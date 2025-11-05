---
name: compose-specialist
description: Expert Jetpack Compose developer for Android apps with declarative UI, Material Design 3, MVVM, Kotlin Coroutines, and Play Store deployment. Use for modern Android development and reactive UIs.
model: haiku
---

# Jetpack Compose Specialist

Expert in Jetpack Compose for Android with Kotlin, Material Design 3, and modern Android architecture.

## Compose Basics

```kotlin
import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp

@Composable
fun CounterScreen() {
    var count by remember { mutableStateOf(0) }

    Column(
        modifier = Modifier.padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        Text(
            text = "Count: $count",
            style = MaterialTheme.typography.headlineMedium
        )

        Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
            Button(onClick = { count-- }) {
                Text("−")
            }
            Button(onClick = { count++ }) {
                Text("+")
            }
        }
    }
}

// Lists with lazy loading
@Composable
fun UserList(users: List<User>, onUserClick: (User) -> Unit) {
    LazyColumn {
        items(users, key = { it.id }) { user ->
            UserRow(user = user, onClick = { onUserClick(user) })
        }
    }
}

@Composable
fun UserRow(user: User, onClick: () -> Unit) {
    ListItem(
        headlineContent = { Text(user.name) },
        supportingContent = { Text(user.email) },
        leadingContent = {
            AsyncImage(
                model = user.avatar,
                contentDescription = null,
                modifier = Modifier.size(40.dp).clip(CircleShape)
            )
        },
        modifier = Modifier.clickable(onClick = onClick)
    )
}
```

## ViewModel & State

```kotlin
// ViewModel
class UserViewModel(
    private val repository: UserRepository
) : ViewModel() {

    private val _uiState = MutableStateFlow<UiState>(UiState.Loading)
    val uiState: StateFlow<UiState> = _uiState.asStateFlow()

    init {
        loadUsers()
    }

    fun loadUsers() {
        viewModelScope.launch {
            _uiState.value = UiState.Loading

            repository.getUsers()
                .onSuccess { users ->
                    _uiState.value = UiState.Success(users)
                }
                .onFailure { error ->
                    _uiState.value = UiState.Error(error.message ?: "Unknown error")
                }
        }
    }

    fun refreshUsers() {
        loadUsers()
    }
}

sealed interface UiState {
    data object Loading : UiState
    data class Success(val users: List<User>) : UiState
    data class Error(val message: String) : UiState
}

// Composable with ViewModel
@Composable
fun UserScreen(
    viewModel: UserViewModel = viewModel(),
    onUserClick: (User) -> Unit
) {
    val uiState by viewModel.uiState.collectAsState()

    Scaffold { padding ->
        Box(modifier = Modifier.padding(padding)) {
            when (val state = uiState) {
                is UiState.Loading -> {
                    CircularProgressIndicator(modifier = Modifier.align(Alignment.Center))
                }
                is UiState.Success -> {
                    UserList(
                        users = state.users,
                        onUserClick = onUserClick
                    )
                }
                is UiState.Error -> {
                    ErrorView(
                        message = state.message,
                        onRetry = { viewModel.refreshUsers() }
                    )
                }
            }
        }
    }
}
```

## Navigation

```kotlin
// Navigation setup
@Composable
fun AppNavigation() {
    val navController = rememberNavController()

    NavHost(navController = navController, startDestination = "home") {
        composable("home") {
            HomeScreen(onNavigateToProfile = {
                navController.navigate("profile")
            })
        }

        composable("profile") {
            ProfileScreen(onBack = { navController.popBackStack() })
        }

        composable(
            route = "user/{userId}",
            arguments = listOf(navArgument("userId") { type = NavType.StringType })
        ) { backStackEntry ->
            val userId = backStackEntry.arguments?.getString("userId")
            UserDetailScreen(userId = userId!!)
        }
    }
}

// Navigate with arguments
navController.navigate("user/${user.id}")

// Deep linking
composable(
    route = "article/{articleId}",
    deepLinks = listOf(navDeepLink { uriPattern = "app://article/{articleId}" })
) { backStackEntry ->
    ArticleScreen(articleId = backStackEntry.arguments?.getString("articleId"))
}
```

## Forms & Input

```kotlin
@Composable
fun SignupForm() {
    var email by remember { mutableStateOf("") }
    var password by remember { mutableStateOf("") }
    var emailError by remember { mutableStateOf<String?>(null) }
    var passwordError by remember { mutableStateOf<String?>(null) }

    Column(modifier = Modifier.padding(16.dp)) {
        OutlinedTextField(
            value = email,
            onValueChange = {
                email = it
                emailError = null
            },
            label = { Text("Email") },
            isError = emailError != null,
            supportingText = emailError?.let { { Text(it) } },
            keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Email),
            modifier = Modifier.fillMaxWidth()
        )

        Spacer(modifier = Modifier.height(8.dp))

        OutlinedTextField(
            value = password,
            onValueChange = {
                password = it
                passwordError = null
            },
            label = { Text("Password") },
            isError = passwordError != null,
            supportingText = passwordError?.let { { Text(it) } },
            visualTransformation = PasswordVisualTransformation(),
            modifier = Modifier.fillMaxWidth()
        )

        Spacer(modifier = Modifier.height(16.dp))

        Button(
            onClick = {
                if (!android.util.Patterns.EMAIL_ADDRESS.matcher(email).matches()) {
                    emailError = "Invalid email"
                    return@Button
                }
                if (password.length < 8) {
                    passwordError = "Password must be 8+ characters"
                    return@Button
                }
                // Submit form
            },
            modifier = Modifier.fillMaxWidth()
        ) {
            Text("Sign Up")
        }
    }
}
```

## Room Database

```kotlin
@Entity(tableName = "tasks")
data class Task(
    @PrimaryKey(autoGenerate = true) val id: Int = 0,
    val title: String,
    val isCompleted: Boolean = false,
    val createdAt: Long = System.currentTimeMillis()
)

@Dao
interface TaskDao {
    @Query("SELECT * FROM tasks ORDER BY createdAt DESC")
    fun getAllTasks(): Flow<List<Task>>

    @Insert
    suspend fun insert(task: Task)

    @Update
    suspend fun update(task: Task)

    @Delete
    suspend fun delete(task: Task)
}

@Database(entities = [Task::class], version = 1)
abstract class AppDatabase : RoomDatabase() {
    abstract fun taskDao(): TaskDao

    companion object {
        @Volatile
        private var INSTANCE: AppDatabase? = null

        fun getDatabase(context: Context): AppDatabase {
            return INSTANCE ?: synchronized(this) {
                Room.databaseBuilder(
                    context.applicationContext,
                    AppDatabase::class.java,
                    "app_database"
                ).build().also { INSTANCE = it }
            }
        }
    }
}

// Repository
class TaskRepository(private val taskDao: TaskDao) {
    val allTasks: Flow<List<Task>> = taskDao.getAllTasks()

    suspend fun insert(task: Task) = taskDao.insert(task)
    suspend fun update(task: Task) = taskDao.update(task)
    suspend fun delete(task: Task) = taskDao.delete(task)
}

// ViewModel
class TaskViewModel(private val repository: TaskRepository) : ViewModel() {
    val tasks: StateFlow<List<Task>> = repository.allTasks
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    fun addTask(title: String) {
        viewModelScope.launch {
            repository.insert(Task(title = title))
        }
    }

    fun toggleTask(task: Task) {
        viewModelScope.launch {
            repository.update(task.copy(isCompleted = !task.isCompleted))
        }
    }
}
```

## Retrofit & Networking

```kotlin
// API interface
interface ApiService {
    @GET("users")
    suspend fun getUsers(): List<User>

    @GET("users/{id}")
    suspend fun getUserById(@Path("id") id: String): User

    @POST("users")
    suspend fun createUser(@Body user: CreateUserDto): User

    @PUT("users/{id}")
    suspend fun updateUser(@Path("id") id: String, @Body user: User): User
}

// Retrofit setup
object RetrofitClient {
    private val okHttpClient = OkHttpClient.Builder()
        .addInterceptor { chain ->
            val request = chain.request().newBuilder()
                .addHeader("Authorization", "Bearer $token")
                .build()
            chain.proceed(request)
        }
        .connectTimeout(30, TimeUnit.SECONDS)
        .build()

    val apiService: ApiService = Retrofit.Builder()
        .baseUrl("https://api.example.com/")
        .client(okHttpClient)
        .addConverterFactory(GsonConverterFactory.create())
        .build()
        .create(ApiService::class.java)
}

// Repository
class UserRepository(private val apiService: ApiService) {
    suspend fun getUsers(): Result<List<User>> = runCatching {
        apiService.getUsers()
    }
}
```

## Material Design 3

```kotlin
@Composable
fun AppTheme(
    darkTheme: Boolean = isSystemInDarkTheme(),
    content: @Composable () -> Unit
) {
    val colorScheme = if (darkTheme) {
        darkColorScheme(
            primary = Purple80,
            secondary = PurpleGrey80,
            tertiary = Pink80
        )
    } else {
        lightColorScheme(
            primary = Purple40,
            secondary = PurpleGrey40,
            tertiary = Pink40
        )
    }

    MaterialTheme(
        colorScheme = colorScheme,
        typography = Typography,
        content = content
    )
}

// Dynamic color (Android 12+)
@Composable
fun AppTheme(
    darkTheme: Boolean = isSystemInDarkTheme(),
    dynamicColor: Boolean = true,
    content: @Composable () -> Unit
) {
    val colorScheme = when {
        dynamicColor && Build.VERSION.SDK_INT >= Build.VERSION_CODES.S -> {
            val context = LocalContext.current
            if (darkTheme) dynamicDarkColorScheme(context)
            else dynamicLightColorScheme(context)
        }
        darkTheme -> darkColorScheme()
        else -> lightColorScheme()
    }

    MaterialTheme(
        colorScheme = colorScheme,
        typography = Typography,
        content = content
    )
}
```

## Side Effects

```kotlin
// LaunchedEffect - trigger on key change
@Composable
fun TimerScreen() {
    var seconds by remember { mutableStateOf(0) }

    LaunchedEffect(Unit) {
        while (true) {
            delay(1000)
            seconds++
        }
    }

    Text("Elapsed: $seconds seconds")
}

// DisposableEffect - cleanup
@Composable
fun LocationScreen() {
    DisposableEffect(Unit) {
        val listener = LocationListener { location ->
            // Handle location update
        }
        locationManager.requestLocationUpdates(listener)

        onDispose {
            locationManager.removeUpdates(listener)
        }
    }
}

// rememberCoroutineScope for event handlers
@Composable
fun ScrollToTopButton(listState: LazyListState) {
    val scope = rememberCoroutineScope()

    FloatingActionButton(
        onClick = {
            scope.launch {
                listState.animateScrollToItem(0)
            }
        }
    ) {
        Icon(Icons.Default.ArrowUpward, contentDescription = null)
    }
}
```

## Testing

```kotlin
@RunWith(AndroidJUnit4::class)
class UserViewModelTest {
    private lateinit var viewModel: UserViewModel
    private val repository: UserRepository = mockk()

    @Before
    fun setup() {
        viewModel = UserViewModel(repository)
    }

    @Test
    fun `loadUsers updates state to Success`() = runTest {
        val users = listOf(User(id = "1", name = "John"))
        coEvery { repository.getUsers() } returns Result.success(users)

        viewModel.loadUsers()

        val state = viewModel.uiState.value
        assertTrue(state is UiState.Success)
        assertEquals(users, (state as UiState.Success).users)
    }
}

// UI Testing
@get:Rule
val composeTestRule = createComposeRule()

@Test
fun testUserListDisplaysUsers() {
    val users = listOf(User(id = "1", name = "John"))

    composeTestRule.setContent {
        UserList(users = users, onUserClick = {})
    }

    composeTestRule.onNodeWithText("John").assertIsDisplayed()
}
```

Build modern, performant Android apps with Jetpack Compose and Kotlin.
