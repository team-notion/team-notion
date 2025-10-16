#!/bin/bash
set -e

echo "Waiting for database to be ready..."
until php artisan migrate:status > /dev/null 2>&1; do
    echo "Database not ready yet... retrying in 5s"
    sleep 5
done

echo "Running migrations..."
php artisan migrate --force

echo "Seeding User Types if not present..."
php -r "
require 'vendor/autoload.php';
\$app = require 'bootstrap/app.php';
\$kernel = \$app->make(Illuminate\Contracts\Console\Kernel::class);
\$kernel->bootstrap();
use App\Models\UserType;
if (UserType::count() === 0) {
    echo 'Seeding User Types...\n';
    \$kernel->call('db:seed', ['--class' => 'UserTypesSeeder', '--force' => true]);
} else {
    echo 'User Types already exist, skipping seeding.\n';
}
"

echo "Starting Laravel server..."
php artisan serve --host=0.0.0.0 --port=\${PORT:-8000}
