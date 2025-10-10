# 1. Use official PHP CLI image with required extensions
FROM php:8.2-cli

# 2. Set working directory inside the container
WORKDIR /app

# 3. Install system dependencies
RUN apt-get update && apt-get install -y \
    git \
    unzip \
    libzip-dev \
    libpq-dev \
    && docker-php-ext-install pdo pdo_pgsql \
    && docker-php-ext-enable pdo_pgsql \
    && apt-get clean

# 4. Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# 5. Copy only the backend folder into the container
COPY . .

# 6. Install PHP dependencies
RUN composer install --no-dev --optimize-autoloader

# 7. Expose port (Render will map $PORT)
EXPOSE 8000

# 8. Run Laravel server
CMD php artisan serve --host=0.0.0.0 --port=$PORT
