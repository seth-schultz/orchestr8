# Ruby Development Patterns

Comprehensive patterns and best practices for Ruby development, referenced by the ruby-developer agent.

## Rails Patterns

### Service Objects
```ruby
# app/services/user_registration_service.rb
class UserRegistrationService
  def initialize(params)
    @params = params
  end

  def call
    ActiveRecord::Base.transaction do
      user = create_user
      assign_role(user)
      send_welcome_email(user)
      user
    end
  rescue ActiveRecord::RecordInvalid => e
    Result.failure(e.record.errors)
  end

  private

  attr_reader :params

  def create_user
    User.create!(
      email: params[:email],
      name: params[:name],
      password: params[:password]
    )
  end

  def assign_role(user)
    user.add_role(:member)
  end

  def send_welcome_email(user)
    UserMailer.welcome_email(user).deliver_later
  end
end

# Usage in controller
def create
  result = UserRegistrationService.new(user_params).call
  if result.success?
    render json: result.value, status: :created
  else
    render json: { errors: result.errors }, status: :unprocessable_entity
  end
end
```

### Form Objects
```ruby
class UserRegistrationForm
  include ActiveModel::Model

  attr_accessor :email, :name, :password, :password_confirmation, :terms_accepted

  validates :email, presence: true, format: { with: URI::MailTo::EMAIL_REGEXP }
  validates :name, presence: true, length: { minimum: 2 }
  validates :password, presence: true, length: { minimum: 8 }
  validates :password_confirmation, presence: true
  validates :terms_accepted, acceptance: true
  validate :passwords_match

  def save
    return false unless valid?

    user = User.create(
      email: email,
      name: name,
      password: password
    )

    user.persisted?
  end

  private

  def passwords_match
    return if password == password_confirmation

    errors.add(:password_confirmation, "doesn't match password")
  end
end
```

### Query Objects
```ruby
class ActiveUsersQuery
  def initialize(relation = User.all)
    @relation = relation
  end

  def call
    @relation
      .where(active: true)
      .where('last_login_at > ?', 30.days.ago)
      .order(last_login_at: :desc)
  end

  def with_premium
    call.where(premium: true)
  end

  def by_country(country_code)
    call.where(country: country_code)
  end
end

# Usage
active_users = ActiveUsersQuery.new.call
premium_users = ActiveUsersQuery.new.with_premium
us_users = ActiveUsersQuery.new.by_country('US')
```

### Decorators (Draper)
```ruby
class UserDecorator < Draper::Decorator
  delegate_all

  def full_name
    "#{object.first_name} #{object.last_name}"
  end

  def formatted_join_date
    object.created_at.strftime("%B %d, %Y")
  end

  def avatar_url
    object.avatar.present? ? object.avatar.url : h.image_path('default_avatar.png')
  end

  def status_badge
    h.content_tag :span, status_text, class: "badge #{status_class}"
  end

  private

  def status_text
    object.active? ? 'Active' : 'Inactive'
  end

  def status_class
    object.active? ? 'badge-success' : 'badge-secondary'
  end
end

# Usage
@user = User.find(params[:id]).decorate
@user.full_name
@user.status_badge
```

## ActiveRecord Patterns

### Concerns
```ruby
# app/models/concerns/searchable.rb
module Searchable
  extend ActiveSupport::Concern

  included do
    scope :search, ->(query) { where('name LIKE ?', "%#{query}%") }
  end

  class_methods do
    def advanced_search(params)
      results = all
      results = results.where(category: params[:category]) if params[:category].present?
      results = results.where('price >= ?', params[:min_price]) if params[:min_price].present?
      results = results.where('price <= ?', params[:max_price]) if params[:max_price].present?
      results
    end
  end
end

class Product < ApplicationRecord
  include Searchable
end
```

### Scopes and Associations
```ruby
class User < ApplicationRecord
  # Associations
  has_many :posts, dependent: :destroy
  has_many :comments, dependent: :destroy
  has_many :authored_posts, class_name: 'Post', foreign_key: 'author_id'
  has_and_belongs_to_many :roles

  # Scopes
  scope :active, -> { where(active: true) }
  scope :premium, -> { where(premium: true) }
  scope :recent, -> { where('created_at > ?', 1.week.ago) }
  scope :by_country, ->(country) { where(country: country) }

  # Validations
  validates :email, presence: true, uniqueness: true, format: { with: URI::MailTo::EMAIL_REGEXP }
  validates :name, presence: true, length: { minimum: 2, maximum: 50 }

  # Callbacks
  before_create :generate_token
  after_create :send_welcome_email
  before_save :normalize_email

  private

  def generate_token
    self.token = SecureRandom.hex(20)
  end

  def send_welcome_email
    UserMailer.welcome_email(self).deliver_later
  end

  def normalize_email
    self.email = email.downcase.strip
  end
end
```

### Custom Validators
```ruby
class EmailValidator < ActiveModel::EachValidator
  def validate_each(record, attribute, value)
    unless value =~ /\A[\w+\-.]+@[a-z\d\-]+(\.[a-z\d\-]+)*\.[a-z]+\z/i
      record.errors.add(attribute, options[:message] || 'is not a valid email')
    end
  end
end

class User < ApplicationRecord
  validates :email, email: true
end
```

## Rails Controllers

### Strong Parameters
```ruby
class UsersController < ApplicationController
  def create
    @user = User.new(user_params)
    if @user.save
      render json: @user, status: :created
    else
      render json: { errors: @user.errors }, status: :unprocessable_entity
    end
  end

  def update
    @user = User.find(params[:id])
    if @user.update(user_params)
      render json: @user
    else
      render json: { errors: @user.errors }, status: :unprocessable_entity
    end
  end

  private

  def user_params
    params.require(:user).permit(:name, :email, :password, role_ids: [])
  end
end
```

### Rescue From
```ruby
class ApplicationController < ActionController::API
  rescue_from ActiveRecord::RecordNotFound, with: :not_found
  rescue_from ActiveRecord::RecordInvalid, with: :unprocessable_entity
  rescue_from ActionController::ParameterMissing, with: :bad_request

  private

  def not_found(exception)
    render json: { error: exception.message }, status: :not_found
  end

  def unprocessable_entity(exception)
    render json: { errors: exception.record.errors }, status: :unprocessable_entity
  end

  def bad_request(exception)
    render json: { error: exception.message }, status: :bad_request
  end
end
```

## Background Jobs (Sidekiq)

```ruby
class SendEmailJob < ApplicationJob
  queue_as :default
  retry_on Net::SMTPServerBusy, wait: :exponentially_longer, attempts: 5

  def perform(user_id, email_type)
    user = User.find(user_id)
    case email_type
    when 'welcome'
      UserMailer.welcome_email(user).deliver_now
    when 'reminder'
      UserMailer.reminder_email(user).deliver_now
    end
  rescue StandardError => e
    Rails.logger.error "Failed to send email: #{e.message}"
    raise e
  end
end

# Enqueue job
SendEmailJob.perform_later(user.id, 'welcome')

# Enqueue with delay
SendEmailJob.set(wait: 1.hour).perform_later(user.id, 'reminder')

# Enqueue with specific queue
SendEmailJob.set(queue: :high_priority).perform_later(user.id, 'urgent')
```

## RSpec Testing Patterns

### Model Specs
```ruby
RSpec.describe User, type: :model do
  describe 'associations' do
    it { should have_many(:posts).dependent(:destroy) }
    it { should have_many(:comments) }
    it { should have_and_belong_to_many(:roles) }
  end

  describe 'validations' do
    it { should validate_presence_of(:email) }
    it { should validate_uniqueness_of(:email).case_insensitive }
    it { should validate_presence_of(:name) }
    it { should validate_length_of(:name).is_at_least(2).is_at_most(50) }
  end

  describe '#full_name' do
    it 'returns first and last name combined' do
      user = User.new(first_name: 'John', last_name: 'Doe')
      expect(user.full_name).to eq('John Doe')
    end
  end
end
```

### Controller Specs
```ruby
RSpec.describe UsersController, type: :controller do
  describe 'POST #create' do
    context 'with valid parameters' do
      let(:valid_params) do
        { user: { name: 'John Doe', email: 'john@example.com' } }
      end

      it 'creates a new user' do
        expect {
          post :create, params: valid_params
        }.to change(User, :count).by(1)
      end

      it 'returns created status' do
        post :create, params: valid_params
        expect(response).to have_http_status(:created)
      end
    end

    context 'with invalid parameters' do
      let(:invalid_params) do
        { user: { name: '', email: 'invalid' } }
      end

      it 'does not create a user' do
        expect {
          post :create, params: invalid_params
        }.not_to change(User, :count)
      end

      it 'returns unprocessable entity status' do
        post :create, params: invalid_params
        expect(response).to have_http_status(:unprocessable_entity)
      end
    end
  end
end
```

### Request Specs
```ruby
RSpec.describe 'Users API', type: :request do
  describe 'GET /users' do
    before do
      create_list(:user, 3)
    end

    it 'returns all users' do
      get '/users'

      expect(response).to have_http_status(:success)
      expect(JSON.parse(response.body).size).to eq(3)
    end
  end

  describe 'POST /users' do
    let(:valid_params) do
      { user: attributes_for(:user) }
    end

    it 'creates a new user' do
      expect {
        post '/users', params: valid_params
      }.to change(User, :count).by(1)

      expect(response).to have_http_status(:created)
    end
  end
end
```

## FactoryBot Patterns

```ruby
FactoryBot.define do
  factory :user do
    sequence(:email) { |n| "user#{n}@example.com" }
    name { Faker::Name.name }
    password { 'password123' }
    active { true }

    trait :inactive do
      active { false }
    end

    trait :premium do
      premium { true }
    end

    trait :with_posts do
      transient do
        posts_count { 3 }
      end

      after(:create) do |user, evaluator|
        create_list(:post, evaluator.posts_count, user: user)
      end
    end

    factory :admin_user do
      after(:create) do |user|
        user.add_role(:admin)
      end
    end
  end
end

# Usage
user = create(:user)
inactive_user = create(:user, :inactive)
premium_user = create(:user, :premium)
user_with_posts = create(:user, :with_posts, posts_count: 5)
admin = create(:admin_user)
```

## Metaprogramming Patterns

```ruby
# Method missing
class DynamicFinder
  def initialize(model)
    @model = model
  end

  def method_missing(method_name, *args, &block)
    if method_name.to_s.start_with?('find_by_')
      attribute = method_name.to_s.sub('find_by_', '')
      @model.find_by(attribute => args.first)
    else
      super
    end
  end

  def respond_to_missing?(method_name, include_private = false)
    method_name.to_s.start_with?('find_by_') || super
  end
end

# Define method
class User
  ROLES = %w[admin moderator member].freeze

  ROLES.each do |role|
    define_method "#{role}?" do
      self.role == role
    end
  end
end

user = User.new(role: 'admin')
user.admin? # => true
user.member? # => false
```

## Performance Optimization

```ruby
# Eager loading
users = User.includes(:posts, :comments).where(active: true)

# Counter cache
class Post < ApplicationRecord
  belongs_to :user, counter_cache: true
end

class User < ApplicationRecord
  has_many :posts
end

# Add column: posts_count to users table

# Database indexing in migration
add_index :users, :email, unique: true
add_index :posts, [:user_id, :created_at]
add_index :posts, :published_at, where: 'published_at IS NOT NULL'

# Caching
class User < ApplicationRecord
  def full_name
    Rails.cache.fetch("user_#{id}_full_name", expires_in: 1.hour) do
      "#{first_name} #{last_name}"
    end
  end
end

# Batch processing
User.find_each(batch_size: 1000) do |user|
  user.update_some_attribute
end

# Pluck for specific columns
user_emails = User.where(active: true).pluck(:email)
```
