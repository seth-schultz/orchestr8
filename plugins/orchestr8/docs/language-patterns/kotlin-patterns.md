# Kotlin Development Patterns

Comprehensive patterns and best practices for Kotlin development, referenced by the kotlin-developer agent.

## Coroutines Patterns

### Structured Concurrency
```kotlin
// Always use structured concurrency
class UserRepository {
    suspend fun fetchUser(id: String): User = coroutineScope {
        val profile = async { fetchProfile(id) }
        val settings = async { fetchSettings(id) }
        User(profile.await(), settings.await())
    }
}

// Avoid GlobalScope - use proper scope
class MyViewModel : ViewModel() {
    fun loadData() {
        viewModelScope.launch {
            // Automatically cancelled when ViewModel is cleared
            val data = repository.fetchData()
            _state.value = data
        }
    }
}
```

### Flow Patterns
```kotlin
// Cold Flow - computed on collection
fun fetchUsers(): Flow<List<User>> = flow {
    val users = api.getUsers()
    emit(users)
}.flowOn(Dispatchers.IO)

// StateFlow for UI state
class MyViewModel : ViewModel() {
    private val _state = MutableStateFlow<UiState>(UiState.Loading)
    val state: StateFlow<UiState> = _state.asStateFlow()

    fun loadData() {
        viewModelScope.launch {
            _state.value = UiState.Loading
            try {
                val data = repository.fetchData()
                _state.value = UiState.Success(data)
            } catch (e: Exception) {
                _state.value = UiState.Error(e.message)
            }
        }
    }
}

// SharedFlow for events
class MyViewModel : ViewModel() {
    private val _events = MutableSharedFlow<Event>()
    val events: SharedFlow<Event> = _events.asSharedFlow()

    fun onAction() {
        viewModelScope.launch {
            _events.emit(Event.ShowToast("Action completed"))
        }
    }
}
```

## Jetpack Compose Patterns

### State Management
```kotlin
// State hoisting
@Composable
fun Counter() {
    var count by remember { mutableStateOf(0) }
    CounterDisplay(
        count = count,
        onIncrement = { count++ }
    )
}

@Composable
fun CounterDisplay(
    count: Int,
    onIncrement: () -> Unit
) {
    Column {
        Text("Count: $count")
        Button(onClick = onIncrement) {
            Text("Increment")
        }
    }
}

// ViewModel integration
@Composable
fun MyScreen(viewModel: MyViewModel = viewModel()) {
    val state by viewModel.state.collectAsStateWithLifecycle()

    when (state) {
        is UiState.Loading -> LoadingIndicator()
        is UiState.Success -> SuccessContent(state.data)
        is UiState.Error -> ErrorMessage(state.message)
    }
}
```

### Side Effects
```kotlin
// LaunchedEffect - run suspend functions
@Composable
fun MyScreen(userId: String) {
    LaunchedEffect(userId) {
        viewModel.loadUser(userId)
    }
}

// DisposableEffect - cleanup resources
@Composable
fun ObserveLifecycle(lifecycle: Lifecycle, observer: LifecycleObserver) {
    DisposableEffect(lifecycle) {
        lifecycle.addObserver(observer)
        onDispose {
            lifecycle.removeObserver(observer)
        }
    }
}
```

## MVVM Architecture

```kotlin
// Model
data class User(
    val id: String,
    val name: String,
    val email: String
)

// Repository
class UserRepository(
    private val api: UserApi,
    private val db: UserDao
) {
    suspend fun getUser(id: String): Result<User> = runCatching {
        val cachedUser = db.getUser(id)
        if (cachedUser != null) return Result.success(cachedUser)

        val user = api.fetchUser(id)
        db.insertUser(user)
        user
    }
}

// ViewModel
class UserViewModel(
    private val repository: UserRepository
) : ViewModel() {
    private val _uiState = MutableStateFlow<UserUiState>(UserUiState.Loading)
    val uiState: StateFlow<UserUiState> = _uiState.asStateFlow()

    fun loadUser(id: String) {
        viewModelScope.launch {
            repository.getUser(id)
                .onSuccess { user ->
                    _uiState.value = UserUiState.Success(user)
                }
                .onFailure { error ->
                    _uiState.value = UserUiState.Error(error.message ?: "Unknown error")
                }
        }
    }
}

sealed interface UserUiState {
    object Loading : UserUiState
    data class Success(val user: User) : UserUiState
    data class Error(val message: String) : UserUiState
}
```

## Room Database Patterns

```kotlin
// Entity
@Entity(tableName = "users")
data class UserEntity(
    @PrimaryKey val id: String,
    @ColumnInfo(name = "name") val name: String,
    @ColumnInfo(name = "email") val email: String,
    @ColumnInfo(name = "created_at") val createdAt: Long
)

// DAO with Flow
@Dao
interface UserDao {
    @Query("SELECT * FROM users WHERE id = :id")
    fun observeUser(id: String): Flow<UserEntity?>

    @Query("SELECT * FROM users")
    fun observeAllUsers(): Flow<List<UserEntity>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertUser(user: UserEntity)

    @Delete
    suspend fun deleteUser(user: UserEntity)
}

// Database
@Database(entities = [UserEntity::class], version = 1)
abstract class AppDatabase : RoomDatabase() {
    abstract fun userDao(): UserDao
}
```

## Dependency Injection (Hilt)

```kotlin
// Module
@Module
@InstallIn(SingletonComponent::class)
object AppModule {
    @Provides
    @Singleton
    fun provideRetrofit(): Retrofit = Retrofit.Builder()
        .baseUrl("https://api.example.com")
        .addConverterFactory(GsonConverterFactory.create())
        .build()

    @Provides
    @Singleton
    fun provideUserApi(retrofit: Retrofit): UserApi =
        retrofit.create(UserApi::class.java)
}

// ViewModel injection
@HiltViewModel
class UserViewModel @Inject constructor(
    private val repository: UserRepository
) : ViewModel() {
    // ...
}

// Composable injection
@Composable
fun MyScreen(viewModel: MyViewModel = hiltViewModel()) {
    // ...
}
```

## Extension Functions

```kotlin
// Context extensions
fun Context.showToast(message: String) {
    Toast.makeText(this, message, Toast.LENGTH_SHORT).show()
}

fun Context.isNetworkAvailable(): Boolean {
    val cm = getSystemService(Context.CONNECTIVITY_SERVICE) as ConnectivityManager
    return cm.activeNetwork != null
}

// View extensions
fun View.visible() {
    visibility = View.VISIBLE
}

fun View.gone() {
    visibility = View.GONE
}

// String extensions
fun String.isValidEmail(): Boolean =
    android.util.Patterns.EMAIL_ADDRESS.matcher(this).matches()
```

## Sealed Classes for Type Safety

```kotlin
// API Response wrapper
sealed class Result<out T> {
    data class Success<T>(val data: T) : Result<T>()
    data class Error(val exception: Throwable) : Result<Nothing>()
    object Loading : Result<Nothing>()
}

// Navigation
sealed class Screen(val route: String) {
    object Home : Screen("home")
    object Profile : Screen("profile/{userId}") {
        fun createRoute(userId: String) = "profile/$userId"
    }
    object Settings : Screen("settings")
}
```

## Testing Patterns

```kotlin
// Unit test with MockK
@Test
fun `loadUser should update state to Success when repository returns user`() = runTest {
    // Given
    val user = User("1", "John", "john@example.com")
    coEvery { repository.getUser("1") } returns Result.success(user)

    // When
    viewModel.loadUser("1")

    // Then
    val state = viewModel.uiState.value
    assertTrue(state is UserUiState.Success)
    assertEquals(user, (state as UserUiState.Success).user)
}

// Compose UI test
@Test
fun counterIncrementsOnButtonClick() {
    composeTestRule.setContent {
        Counter()
    }

    composeTestRule.onNodeWithText("Count: 0").assertExists()
    composeTestRule.onNodeWithText("Increment").performClick()
    composeTestRule.onNodeWithText("Count: 1").assertExists()
}
```

## Performance Best Practices

```kotlin
// Use remember for expensive computations
@Composable
fun ExpensiveList(items: List<Item>) {
    val sortedItems = remember(items) {
        items.sortedBy { it.priority }
    }
    // ...
}

// Use derivedStateOf for derived values
@Composable
fun FilteredList(items: List<Item>, filter: String) {
    val filteredItems by remember {
        derivedStateOf {
            items.filter { it.name.contains(filter, ignoreCase = true) }
        }
    }
    // ...
}

// Avoid unnecessary recompositions
@Composable
fun UserItem(
    user: User,
    onClick: (String) -> Unit,
    modifier: Modifier = Modifier
) {
    val clickHandler = remember(user.id) {
        { onClick(user.id) }
    }
    // ...
}
```
