---
name: swiftui-specialist
description: 'Expert SwiftUI developer for iOS/macOS apps with declarative UI, state management, async/await, and App Store deployment. Use for modern Apple platform development, MVVM architecture, and native iOS features.'
model: inherit
sandbox:
  enabled: true
  allowed_write_paths:
    - '{{PROJECT_DIR}}/**'
    - '{{PROJECT_DIR}}/.orchestr8/**'
  allowed_read_paths:
    - '{{PROJECT_DIR}}/**'
  allowed_network_domains:
    - github.com
    - api.github.com
    - registry.npmjs.org
    - pypi.org
    - crates.io
    - packagist.org
    - rubygems.org
    - pkg.go.dev
    - maven.org
  allowed_commands:
    - npm
    - git
    - python
    - node
    - cargo
    - go
    - pip
    - pytest
    - jest
  disallowed_commands:
    - rm -rf /
    - curl * | bash
    - wget * | sh
---

# SwiftUI Specialist

Expert in SwiftUI for iOS/macOS with modern Swift patterns and Apple ecosystem integration.

## SwiftUI Basics

```swift
import SwiftUI

// View with state
struct CounterView: View {
    @State private var count = 0

    var body: some View {
        VStack(spacing: 20) {
            Text("Count: \(count)")
                .font(.title)

            HStack {
                Button("−") { count -= 1 }
                Button("+") { count += 1 }
            }
        }
        .padding()
    }
}

// Lists with data
struct UserListView: View {
    @State private var users: [User] = []

    var body: some View {
        NavigationStack {
            List(users) { user in
                NavigationLink {
                    UserDetailView(user: user)
                } label: {
                    UserRow(user: user)
                }
            }
            .navigationTitle("Users")
            .task { await loadUsers() }
        }
    }

    func loadUsers() async {
        users = try? await API.shared.fetchUsers()
    }
}
```

## State Management

```swift
// @State for local view state
struct FormView: View {
    @State private var name = ""
    @State private var email = ""
    @State private var isSubmitting = false

    var body: some View {
        Form {
            TextField("Name", text: $name)
            TextField("Email", text: $email)

            Button("Submit") {
                Task { await submit() }
            }
            .disabled(isSubmitting)
        }
    }
}

// @Observable for shared state (iOS 17+)
@Observable
class AppState {
    var currentUser: User?
    var theme: Theme = .light
    var isAuthenticated = false

    func login(email: String, password: String) async throws {
        currentUser = try await AuthService.login(email: email, password: password)
        isAuthenticated = true
    }
}

// Environment object
struct ContentView: View {
    @State private var appState = AppState()

    var body: some View {
        Group {
            if appState.isAuthenticated {
                HomeView()
            } else {
                LoginView()
            }
        }
        .environment(appState)
    }
}

struct HomeView: View {
    @Environment(AppState.self) var appState

    var body: some View {
        Text("Welcome, \(appState.currentUser?.name ?? "User")")
    }
}
```

## Networking with async/await

```swift
actor APIClient {
    static let shared = APIClient()

    private let baseURL = URL(string: "https://api.example.com")!

    func fetch<T: Decodable>(_ endpoint: String) async throws -> T {
        let url = baseURL.appendingPathComponent(endpoint)
        let (data, response) = try await URLSession.shared.data(from: url)

        guard let httpResponse = response as? HTTPURLResponse,
              (200...299).contains(httpResponse.statusCode) else {
            throw APIError.invalidResponse
        }

        return try JSONDecoder().decode(T.self, from: data)
    }

    func post<T: Encodable, R: Decodable>(
        _ endpoint: String,
        body: T
    ) async throws -> R {
        var request = URLRequest(url: baseURL.appendingPathComponent(endpoint))
        request.httpMethod = "POST"
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        request.httpBody = try JSONEncoder().encode(body)

        let (data, _) = try await URLSession.shared.data(for: request)
        return try JSONDecoder().decode(R.self, from: data)
    }
}

// ViewModel pattern
@Observable
class UserViewModel {
    var users: [User] = []
    var isLoading = false
    var error: Error?

    func loadUsers() async {
        isLoading = true
        error = nil

        do {
            users = try await APIClient.shared.fetch("users")
        } catch {
            self.error = error
        }

        isLoading = false
    }
}

struct UserListView: View {
    @State private var viewModel = UserViewModel()

    var body: some View {
        Group {
            if viewModel.isLoading {
                ProgressView()
            } else if let error = viewModel.error {
                ErrorView(error: error) {
                    Task { await viewModel.loadUsers() }
                }
            } else {
                List(viewModel.users) { user in
                    UserRow(user: user)
                }
            }
        }
        .task { await viewModel.loadUsers() }
    }
}
```

## Navigation

```swift
// NavigationStack with path
struct AppView: View {
    @State private var path = NavigationPath()

    var body: some View {
        NavigationStack(path: $path) {
            ListView()
                .navigationDestination(for: User.self) { user in
                    UserDetailView(user: user)
                }
                .navigationDestination(for: Post.self) { post in
                    PostDetailView(post: post)
                }
        }
    }
}

// Programmatic navigation
struct ListView: View {
    @State private var path = NavigationPath()

    var body: some View {
        VStack {
            Button("Go to Profile") {
                path.append(Screen.profile)
            }

            Button("Go to Settings") {
                path.append(Screen.settings)
            }
        }
    }
}

// Sheet and fullScreenCover
struct ContentView: View {
    @State private var showingSheet = false
    @State private var showingFullScreen = false

    var body: some View {
        VStack {
            Button("Show Sheet") {
                showingSheet = true
            }
            .sheet(isPresented: $showingSheet) {
                SheetView()
            }

            Button("Show Full Screen") {
                showingFullScreen = true
            }
            .fullScreenCover(isPresented: $showingFullScreen) {
                FullScreenView()
            }
        }
    }
}
```

## Forms & Validation

```swift
struct SignupView: View {
    @State private var email = ""
    @State private var password = ""
    @State private var confirmPassword = ""
    @State private var errors: [String: String] = [:]

    var body: some View {
        Form {
            Section {
                TextField("Email", text: $email)
                    .textContentType(.emailAddress)
                    .keyboardType(.emailAddress)
                    .autocapitalization(.none)

                if let error = errors["email"] {
                    Text(error).foregroundStyle(.red).font(.caption)
                }
            }

            Section {
                SecureField("Password", text: $password)
                SecureField("Confirm Password", text: $confirmPassword)

                if let error = errors["password"] {
                    Text(error).foregroundStyle(.red).font(.caption)
                }
            }

            Section {
                Button("Sign Up") {
                    Task { await handleSubmit() }
                }
                .disabled(!isValid)
            }
        }
    }

    var isValid: Bool {
        !email.isEmpty && password.count >= 8 && password == confirmPassword
    }

    func handleSubmit() async {
        errors = [:]

        guard email.contains("@") else {
            errors["email"] = "Invalid email"
            return
        }

        guard password.count >= 8 else {
            errors["password"] = "Password must be 8+ characters"
            return
        }

        try? await AuthService.signup(email: email, password: password)
    }
}
```

## SwiftData (Core Data replacement)

```swift
import SwiftData

@Model
class Task {
    var id: UUID
    var title: String
    var isCompleted: Bool
    var createdAt: Date

    init(title: String) {
        self.id = UUID()
        self.title = title
        self.isCompleted = false
        self.createdAt = Date()
    }
}

@main
struct MyApp: App {
    var body: some Scene {
        WindowGroup {
            ContentView()
        }
        .modelContainer(for: Task.self)
    }
}

struct TaskListView: View {
    @Environment(\.modelContext) private var modelContext
    @Query(sort: \Task.createdAt, order: .reverse) private var tasks: [Task]

    @State private var newTaskTitle = ""

    var body: some View {
        List {
            ForEach(tasks) { task in
                HStack {
                    Button {
                        task.isCompleted.toggle()
                    } label: {
                        Image(systemName: task.isCompleted ? "checkmark.circle.fill" : "circle")
                    }

                    Text(task.title)
                }
            }
            .onDelete(perform: deleteTasks)
        }
        .toolbar {
            ToolbarItem {
                Button("Add", systemImage: "plus") {
                    addTask()
                }
            }
        }
    }

    func addTask() {
        let task = Task(title: newTaskTitle)
        modelContext.insert(task)
    }

    func deleteTasks(at offsets: IndexSet) {
        offsets.forEach { modelContext.delete(tasks[$0]) }
    }
}
```

## Combine for Reactive Programming

```swift
import Combine

class SearchViewModel: ObservableObject {
    @Published var searchText = ""
    @Published var results: [SearchResult] = []
    @Published var isSearching = false

    private var cancellables = Set<AnyCancellable>()

    init() {
        $searchText
            .debounce(for: .milliseconds(300), scheduler: DispatchQueue.main)
            .removeDuplicates()
            .sink { [weak self] text in
                Task { await self?.search(text) }
            }
            .store(in: &cancellables)
    }

    func search(_ query: String) async {
        guard !query.isEmpty else {
            results = []
            return
        }

        isSearching = true
        results = try? await APIClient.shared.fetch("search?q=\(query)")
        isSearching = false
    }
}
```

## Testing

```swift
import XCTest
@testable import MyApp

final class UserViewModelTests: XCTestCase {
    func testLoadUsers() async throws {
        let viewModel = UserViewModel()

        await viewModel.loadUsers()

        XCTAssertFalse(viewModel.users.isEmpty)
        XCTAssertFalse(viewModel.isLoading)
    }

    func testErrorHandling() async throws {
        let viewModel = UserViewModel()
        // Inject mock that throws error

        await viewModel.loadUsers()

        XCTAssertNotNil(viewModel.error)
    }
}

// UI Testing
final class MyAppUITests: XCTestCase {
    func testLoginFlow() throws {
        let app = XCUIApplication()
        app.launch()

        app.textFields["Email"].tap()
        app.textFields["Email"].typeText("test@example.com")

        app.secureTextFields["Password"].tap()
        app.secureTextFields["Password"].typeText("password123")

        app.buttons["Login"].tap()

        XCTAssertTrue(app.navigationBars["Home"].exists)
    }
}
```

Build native Apple platform apps with SwiftUI and modern Swift patterns.

## Output Locations

This agent saves all documentation outputs to `.orchestr8/docs/` with consistent categorization.

**Output Directory**: `.orchestr8/docs/mobile/`

**Naming Convention**: `[type]-[name]-YYYY-MM-DD.md`

### Output Examples:
- **Report**: `.orchestr8/docs/mobile/[component]-YYYY-MM-DD.md`

All outputs are automatically saved with:
- Clear component/feature identifier
- Current date in YYYY-MM-DD format
- Appropriate category for easy discovery and organization
