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
    libonig-dev \
    libxml2-dev \
    libcurl4-openssl-dev \
    pkg-config \
    libssl-dev \
    && docker-php-ext-install pdo pdo_pgsql zip bcmath opcache \
    && docker-php-ext-enable pdo_pgsql zip bcmath opcache \
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
CMD echo "Waiting for database..." && \
    sleep 10 && \
    php artisan migrate --force && \
    if [ "$(php artisan tinker --execute='echo \App\\Models\\User::count();')" = "0" ]; then \
        echo 'Seeding database...'; \
        php artisan db:seed --force; \
    else \
        echo 'Skipping seeding — data already exists.'; \
    fi && \
    php artisan serve --host=0.0.0.0 --port=$PORT
