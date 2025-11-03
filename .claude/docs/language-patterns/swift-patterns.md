# Swift Development Patterns

Comprehensive patterns and best practices for Swift development, referenced by the swift-developer agent.

## Async/Await Patterns

### Structured Concurrency
```swift
// Task groups for parallel execution
func fetchUserData(userId: String) async throws -> UserData {
    try await withThrowingTaskGroup(of: DataPart.self) { group in
        group.addTask { try await fetchProfile(userId) }
        group.addTask { try await fetchSettings(userId) }
        group.addTask { try await fetchPreferences(userId) }

        var profile: Profile?
        var settings: Settings?
        var preferences: Preferences?

        for try await part in group {
            switch part {
            case .profile(let p): profile = p
            case .settings(let s): settings = s
            case .preferences(let pr): preferences = pr
            }
        }

        return UserData(profile: profile!, settings: settings!, preferences: preferences!)
    }
}

// Actor for thread-safe state
actor Counter {
    private var value = 0

    func increment() -> Int {
        value += 1
        return value
    }

    func getValue() -> Int {
        value
    }
}
```

### AsyncSequence
```swift
// Custom AsyncSequence
struct NetworkStream: AsyncSequence {
    typealias Element = Data

    func makeAsyncIterator() -> AsyncIterator {
        AsyncIterator()
    }

    struct AsyncIterator: AsyncIteratorProtocol {
        mutating func next() async throws -> Data? {
            // Fetch next chunk of data
            try await fetchNextChunk()
        }
    }
}

// Using AsyncSequence
for try await data in networkStream {
    process(data)
}
```

## SwiftUI Patterns

### MVVM Architecture
```swift
// Model
struct User: Identifiable, Codable {
    let id: UUID
    let name: String
    let email: String
}

// ViewModel
@MainActor
class UserViewModel: ObservableObject {
    @Published private(set) var users: [User] = []
    @Published private(set) var isLoading = false
    @Published private(set) var error: Error?

    private let repository: UserRepository

    init(repository: UserRepository = UserRepository()) {
        self.repository = repository
    }

    func loadUsers() async {
        isLoading = true
        error = nil

        do {
            users = try await repository.fetchUsers()
        } catch {
            self.error = error
        }

        isLoading = false
    }
}

// View
struct UserListView: View {
    @StateObject private var viewModel = UserViewModel()

    var body: some View {
        Group {
            if viewModel.isLoading {
                ProgressView()
            } else if let error = viewModel.error {
                ErrorView(error: error)
            } else {
                List(viewModel.users) { user in
                    UserRow(user: user)
                }
            }
        }
        .task {
            await viewModel.loadUsers()
        }
    }
}
```

### State Management
```swift
// @State for local view state
struct Counter: View {
    @State private var count = 0

    var body: some View {
        VStack {
            Text("Count: \(count)")
            Button("Increment") {
                count += 1
            }
        }
    }
}

// @Binding for two-way binding
struct FilterView: View {
    @Binding var filterText: String

    var body: some View {
        TextField("Filter", text: $filterText)
    }
}

// @Environment for dependency injection
struct ContentView: View {
    @Environment(\.managedObjectContext) private var viewContext
    @Environment(\.colorScheme) private var colorScheme

    var body: some View {
        // Use viewContext and colorScheme
    }
}

// @EnvironmentObject for shared state
class AppState: ObservableObject {
    @Published var isLoggedIn = false
    @Published var currentUser: User?
}

struct RootView: View {
    @StateObject private var appState = AppState()

    var body: some View {
        ContentView()
            .environmentObject(appState)
    }
}

struct ContentView: View {
    @EnvironmentObject var appState: AppState

    var body: some View {
        if appState.isLoggedIn {
            MainView()
        } else {
            LoginView()
        }
    }
}
```

### ViewModifiers
```swift
// Custom ViewModifier
struct CardStyle: ViewModifier {
    func body(content: Content) -> some View {
        content
            .padding()
            .background(Color.white)
            .cornerRadius(10)
            .shadow(radius: 5)
    }
}

extension View {
    func cardStyle() -> some View {
        modifier(CardStyle())
    }
}

// Usage
Text("Hello")
    .cardStyle()
```

## Combine Patterns

```swift
// Publishers and Subscribers
class SearchViewModel: ObservableObject {
    @Published var searchText = ""
    @Published private(set) var results: [Result] = []

    private var cancellables = Set<AnyCancellable>()

    init() {
        $searchText
            .debounce(for: .milliseconds(300), scheduler: DispatchQueue.main)
            .removeDuplicates()
            .flatMap { text -> AnyPublisher<[Result], Never> in
                guard !text.isEmpty else {
                    return Just([]).eraseToAnyPublisher()
                }
                return self.search(text)
                    .catch { _ in Just([]) }
                    .eraseToAnyPublisher()
            }
            .assign(to: &$results)
    }

    func search(_ query: String) -> AnyPublisher<[Result], Error> {
        URLSession.shared
            .dataTaskPublisher(for: searchURL(query))
            .map(\.data)
            .decode(type: [Result].self, decoder: JSONDecoder())
            .eraseToAnyPublisher()
    }
}
```

## Core Data Patterns

```swift
// NSManagedObject subclass
@objc(User)
public class User: NSManagedObject {
    @NSManaged public var id: UUID
    @NSManaged public var name: String
    @NSManaged public var email: String
    @NSManaged public var createdAt: Date
}

// Repository pattern
class UserRepository {
    private let context: NSManagedObjectContext

    init(context: NSManagedObjectContext) {
        self.context = context
    }

    func fetchUsers() async throws -> [User] {
        let request = User.fetchRequest()
        request.sortDescriptors = [NSSortDescriptor(key: "name", ascending: true)]

        return try await context.perform {
            try self.context.fetch(request)
        }
    }

    func saveUser(name: String, email: String) async throws {
        try await context.perform {
            let user = User(context: self.context)
            user.id = UUID()
            user.name = name
            user.email = email
            user.createdAt = Date()

            try self.context.save()
        }
    }
}

// SwiftUI integration
struct UserListView: View {
    @FetchRequest(
        entity: User.entity(),
        sortDescriptors: [NSSortDescriptor(keyPath: \User.name, ascending: true)]
    ) var users: FetchedResults<User>

    var body: some View {
        List(users) { user in
            Text(user.name)
        }
    }
}
```

## Protocol-Oriented Programming

```swift
// Protocol with associated type
protocol Repository {
    associatedtype Entity
    func fetch(id: String) async throws -> Entity
    func save(_ entity: Entity) async throws
}

// Protocol with default implementation
protocol Identifiable {
    var id: String { get }
}

extension Identifiable {
    func isSame(as other: any Identifiable) -> Bool {
        self.id == other.id
    }
}

// Protocol composition
typealias Cacheable = Codable & Identifiable

struct User: Cacheable {
    let id: String
    let name: String
}
```

## Result Type and Error Handling

```swift
// Result type usage
func fetchUser(id: String) async -> Result<User, NetworkError> {
    do {
        let user = try await networkService.getUser(id)
        return .success(user)
    } catch let error as NetworkError {
        return .failure(error)
    } catch {
        return .failure(.unknown)
    }
}

// Using Result
let result = await fetchUser(id: "123")
switch result {
case .success(let user):
    print("User: \(user.name)")
case .failure(let error):
    print("Error: \(error)")
}

// Custom errors
enum NetworkError: Error, LocalizedError {
    case invalidURL
    case requestFailed(statusCode: Int)
    case decodingFailed
    case unknown

    var errorDescription: String? {
        switch self {
        case .invalidURL:
            return "The URL is invalid"
        case .requestFailed(let code):
            return "Request failed with status code: \(code)"
        case .decodingFailed:
            return "Failed to decode response"
        case .unknown:
            return "An unknown error occurred"
        }
    }
}
```

## Property Wrappers

```swift
// Custom property wrapper
@propertyWrapper
struct Trimmed {
    private var value: String = ""

    var wrappedValue: String {
        get { value }
        set { value = newValue.trimmingCharacters(in: .whitespaces) }
    }
}

struct User {
    @Trimmed var name: String
    @Trimmed var email: String
}

// UserDefaults property wrapper
@propertyWrapper
struct UserDefault<T> {
    let key: String
    let defaultValue: T

    var wrappedValue: T {
        get {
            UserDefaults.standard.object(forKey: key) as? T ?? defaultValue
        }
        set {
            UserDefaults.standard.set(newValue, forKey: key)
        }
    }
}

struct Settings {
    @UserDefault(key: "isDarkMode", defaultValue: false)
    static var isDarkMode: Bool

    @UserDefault(key: "username", defaultValue: "")
    static var username: String
}
```

## Memory Management

```swift
// Weak references to avoid retain cycles
class ViewModel: ObservableObject {
    private let service: NetworkService

    init(service: NetworkService) {
        self.service = service
    }

    func loadData() async {
        service.onDataReceived = { [weak self] data in
            self?.processData(data)
        }
    }
}

// Unowned for guaranteed lifetime
class View {
    unowned let parentViewController: UIViewController

    init(parent: UIViewController) {
        self.parentViewController = parent
    }
}

// Capture lists in closures
URLSession.shared.dataTask(with: url) { [weak self] data, response, error in
    guard let self = self else { return }
    self.processData(data)
}
```

## Testing Patterns

```swift
// Protocol-based dependency injection for testing
protocol UserRepositoryProtocol {
    func fetchUser(id: String) async throws -> User
}

class UserViewModel {
    private let repository: UserRepositoryProtocol

    init(repository: UserRepositoryProtocol) {
        self.repository = repository
    }
}

// Mock for testing
class MockUserRepository: UserRepositoryProtocol {
    var mockUser: User?
    var mockError: Error?

    func fetchUser(id: String) async throws -> User {
        if let error = mockError {
            throw error
        }
        return mockUser ?? User(id: id, name: "Mock User", email: "mock@test.com")
    }
}

// Unit test
func testFetchUser() async throws {
    // Given
    let mockRepo = MockUserRepository()
    mockRepo.mockUser = User(id: "1", name: "Test", email: "test@test.com")
    let viewModel = UserViewModel(repository: mockRepo)

    // When
    await viewModel.loadUser(id: "1")

    // Then
    XCTAssertEqual(viewModel.user?.name, "Test")
}
```

## Performance Best Practices

```swift
// Lazy properties
class DataManager {
    lazy var expensiveResource: ExpensiveResource = {
        return ExpensiveResource()
    }()
}

// Value types (structs) over reference types (classes) when appropriate
struct Point {  // Value type - copied on assignment
    var x: Double
    var y: Double
}

// Copy-on-write for large value types
struct LargeCollection {
    private var storage: Storage

    mutating func modify() {
        if !isKnownUniquelyReferenced(&storage) {
            storage = storage.copy()
        }
        storage.modify()
    }
}

// Use @MainActor for UI updates
@MainActor
class ViewModel: ObservableObject {
    @Published var data: [Item] = []

    func loadData() async {
        let items = await fetchItems() // Can be on background thread
        self.data = items  // Guaranteed on main thread
    }
}
```
