#!/bin/bash

echo "=========================================="
echo "  TechWithTanziya Backend Setup"
echo "=========================================="
echo ""

# Check if .env exists
if [ ! -f "backend/.env" ]; then
    echo "Creating .env file..."
    cp backend/.env.example backend/.env
    echo "✅ .env file created"
else
    echo "✅ .env file already exists"
fi

echo ""
echo "Choose MongoDB option:"
echo "1. MongoDB Atlas (Cloud - Recommended)"
echo "2. Local MongoDB"
echo "3. Skip for now"
echo ""
read -p "Enter choice (1-3): " choice

case $choice in
    1)
        echo ""
        echo "MongoDB Atlas Setup:"
        echo "1. Go to https://www.mongodb.com/cloud/atlas"
        echo "2. Create free cluster"
        echo "3. Create database user"
        echo "4. Get connection string"
        echo "5. Copy connection string"
        echo ""
        read -p "Paste your MongoDB connection string: " mongodb_uri
        
        # Update .env file
        sed -i "s|MONGODB_URI=.*|MONGODB_URI=$mongodb_uri|" backend/.env
        echo "✅ MongoDB URI updated in .env"
        ;;
    2)
        echo ""
        echo "Local MongoDB Setup:"
        echo "Make sure MongoDB is installed and running"
        echo "Default connection: mongodb://localhost:27017/tech-with-tanziya"
        echo ""
        sed -i 's|MONGODB_URI=.*|MONGODB_URI=mongodb://localhost:27017/tech-with-tanziya|' backend/.env
        echo "✅ Local MongoDB URI set in .env"
        ;;
    3)
        echo "Skipping MongoDB setup"
        echo "You can configure it later in backend/.env"
        ;;
    *)
        echo "Invalid choice"
        exit 1
        ;;
esac

echo ""
echo "=========================================="
echo "  Setup Complete!"
echo "=========================================="
echo ""
echo "Next steps:"
echo "1. cd backend"
echo "2. npm run dev"
echo ""
echo "Check backend/.env for configuration"
echo ""