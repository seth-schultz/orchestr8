# PHP Development Patterns

Comprehensive patterns and best practices for PHP development, referenced by the php-developer agent.

## Laravel Patterns

### Service-Repository Pattern
```php
// Repository
interface UserRepositoryInterface
{
    public function find(int $id): ?User;
    public function create(array $data): User;
    public function update(int $id, array $data): bool;
}

class UserRepository implements UserRepositoryInterface
{
    public function find(int $id): ?User
    {
        return User::find($id);
    }

    public function create(array $data): User
    {
        return User::create($data);
    }

    public function update(int $id, array $data): bool
    {
        return User::where('id', $id)->update($data);
    }
}

// Service
class UserService
{
    public function __construct(
        private UserRepositoryInterface $repository,
        private NotificationService $notificationService
    ) {}

    public function createUser(array $data): User
    {
        $user = $this->repository->create($data);
        $this->notificationService->sendWelcomeEmail($user);
        return $user;
    }
}

// Service Provider binding
public function register(): void
{
    $this->app->bind(
        UserRepositoryInterface::class,
        UserRepository::class
    );
}
```

### Form Requests
```php
class StoreUserRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('create', User::class);
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'unique:users,email'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
            'role_id' => ['required', 'exists:roles,id'],
        ];
    }

    public function messages(): array
    {
        return [
            'email.unique' => 'This email address is already registered.',
        ];
    }
}

// Controller usage
public function store(StoreUserRequest $request): JsonResponse
{
    $user = $this->userService->createUser($request->validated());
    return response()->json($user, 201);
}
```

### Eloquent Relationships
```php
class User extends Model
{
    // One-to-Many
    public function posts(): HasMany
    {
        return $this->hasMany(Post::class);
    }

    // Many-to-Many
    public function roles(): BelongsToMany
    {
        return $this->belongsToMany(Role::class)
            ->withTimestamps()
            ->withPivot('expires_at');
    }

    // Has One Through
    public function latestPost(): HasOne
    {
        return $this->hasOne(Post::class)->latestOfMany();
    }

    // Polymorphic
    public function comments(): MorphMany
    {
        return $this->morphMany(Comment::class, 'commentable');
    }
}

// Query optimization
$users = User::with(['posts', 'roles'])
    ->whereHas('posts', function ($query) {
        $query->where('published', true);
    })
    ->get();
```

### Resource Transformers
```php
class UserResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->when($request->user()->isAdmin(), $this->email),
            'posts' => PostResource::collection($this->whenLoaded('posts')),
            'created_at' => $this->created_at->toISOString(),
            'links' => [
                'self' => route('users.show', $this->id),
            ],
        ];
    }
}

// Usage
return UserResource::collection(User::paginate(15));
```

## Modern PHP 8+ Features

### Named Arguments
```php
function createUser(
    string $name,
    string $email,
    bool $isAdmin = false,
    ?string $phone = null
): User {
    // ...
}

// Call with named arguments
$user = createUser(
    email: 'user@example.com',
    name: 'John Doe',
    isAdmin: true
);
```

### Constructor Property Promotion
```php
class UserService
{
    public function __construct(
        private UserRepository $repository,
        private EmailService $emailService,
        private LoggerInterface $logger
    ) {}
}
```

### Match Expression
```php
$status = match ($user->role) {
    'admin' => 'full_access',
    'editor' => 'edit_access',
    'viewer' => 'read_only',
    default => 'no_access',
};
```

### Union Types
```php
function process(int|float|string $value): string|int
{
    return match (gettype($value)) {
        'integer', 'double' => (int) $value * 2,
        'string' => strtoupper($value),
    };
}
```

### Attributes
```php
#[Route('/api/users', methods: ['GET'])]
#[Middleware('auth:api')]
class UserController
{
    #[Cache(ttl: 3600)]
    public function index(): JsonResponse
    {
        // ...
    }
}
```

## Dependency Injection

```php
// Constructor Injection (Laravel)
class UserController extends Controller
{
    public function __construct(
        private UserService $userService,
        private CacheManager $cache
    ) {}

    public function index(): JsonResponse
    {
        $users = $this->userService->getAllUsers();
        return response()->json($users);
    }
}

// Method Injection
public function store(StoreUserRequest $request, UserService $service): JsonResponse
{
    $user = $service->createUser($request->validated());
    return response()->json($user, 201);
}

// Container binding
$this->app->singleton(UserServiceInterface::class, function ($app) {
    return new UserService(
        $app->make(UserRepository::class),
        $app->make(CacheManager::class)
    );
});
```

## Testing Patterns

### Feature Tests
```php
class UserApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_be_created(): void
    {
        $response = $this->postJson('/api/users', [
            'name' => 'John Doe',
            'email' => 'john@example.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
        ]);

        $response->assertStatus(201)
            ->assertJson([
                'name' => 'John Doe',
                'email' => 'john@example.com',
            ]);

        $this->assertDatabaseHas('users', [
            'email' => 'john@example.com',
        ]);
    }
}
```

### Unit Tests with Mocking
```php
class UserServiceTest extends TestCase
{
    public function test_create_user_sends_welcome_email(): void
    {
        // Arrange
        $repository = $this->mock(UserRepositoryInterface::class);
        $notificationService = $this->mock(NotificationService::class);

        $user = new User(['id' => 1, 'email' => 'test@example.com']);
        $repository->shouldReceive('create')
            ->once()
            ->andReturn($user);

        $notificationService->shouldReceive('sendWelcomeEmail')
            ->once()
            ->with($user);

        $service = new UserService($repository, $notificationService);

        // Act
        $result = $service->createUser(['email' => 'test@example.com']);

        // Assert
        $this->assertEquals($user, $result);
    }
}
```

## Error Handling

```php
// Custom exceptions
class UserNotFoundException extends Exception
{
    public static function forId(int $id): self
    {
        return new self("User with ID {$id} not found");
    }
}

// Global exception handler
public function render($request, Throwable $exception)
{
    if ($exception instanceof ValidationException) {
        return response()->json([
            'message' => 'Validation failed',
            'errors' => $exception->errors(),
        ], 422);
    }

    if ($exception instanceof ModelNotFoundException) {
        return response()->json([
            'message' => 'Resource not found',
        ], 404);
    }

    return parent::render($request, $exception);
}

// Try-catch with logging
try {
    $user = $this->userService->findUser($id);
} catch (UserNotFoundException $e) {
    Log::warning('User not found', ['id' => $id]);
    throw $e;
} catch (Exception $e) {
    Log::error('Unexpected error', ['exception' => $e]);
    throw new HttpException(500, 'An error occurred');
}
```

## Middleware Patterns

```php
class EnsureUserIsAdmin
{
    public function handle(Request $request, Closure $next): Response
    {
        if (!$request->user() || !$request->user()->isAdmin()) {
            abort(403, 'Unauthorized action.');
        }

        return $next($request);
    }
}

// Terminable middleware
class LogRequests
{
    public function handle(Request $request, Closure $next): Response
    {
        return $next($request);
    }

    public function terminate(Request $request, Response $response): void
    {
        Log::info('Request completed', [
            'url' => $request->fullUrl(),
            'method' => $request->method(),
            'status' => $response->status(),
        ]);
    }
}
```

## Queue Jobs

```php
class SendWelcomeEmail implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public function __construct(
        private User $user
    ) {}

    public function handle(EmailService $emailService): void
    {
        $emailService->send(
            $this->user->email,
            'Welcome!',
            'emails.welcome',
            ['user' => $this->user]
        );
    }

    public function failed(Throwable $exception): void
    {
        Log::error('Failed to send welcome email', [
            'user_id' => $this->user->id,
            'exception' => $exception,
        ]);
    }
}

// Dispatch
SendWelcomeEmail::dispatch($user)
    ->onQueue('emails')
    ->delay(now()->addMinutes(5));
```

## Database Migrations

```php
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('email')->unique();
            $table->timestamp('email_verified_at')->nullable();
            $table->string('password');
            $table->foreignId('role_id')->constrained()->onDelete('cascade');
            $table->rememberToken();
            $table->timestamps();
            $table->softDeletes();

            $table->index(['email', 'created_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('users');
    }
};
```

## API Rate Limiting

```php
// Route definition
Route::middleware('throttle:api')->group(function () {
    Route::apiResource('users', UserController::class);
});

// Custom rate limiter
RateLimiter::for('api', function (Request $request) {
    return $request->user()
        ? Limit::perMinute(100)->by($request->user()->id)
        : Limit::perMinute(10)->by($request->ip());
});
```

## Performance Optimization

```php
// Eager loading to prevent N+1
$users = User::with(['posts', 'roles.permissions'])->get();

// Chunking large datasets
User::chunk(1000, function ($users) {
    foreach ($users as $user) {
        // Process user
    }
});

// Lazy collections for memory efficiency
User::cursor()->each(function ($user) {
    // Process one user at a time
});

// Cache expensive queries
$users = Cache::remember('all_users', 3600, function () {
    return User::with('roles')->get();
});

// Database query optimization
$users = User::select(['id', 'name', 'email'])
    ->where('active', true)
    ->orderBy('created_at', 'desc')
    ->limit(100)
    ->get();
```
