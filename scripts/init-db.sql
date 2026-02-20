-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  image_url VARCHAR(500),
  category VARCHAR(100) NOT NULL,
  sizes VARCHAR(50)[] DEFAULT ARRAY[]::VARCHAR[],
  colors VARCHAR(50)[] DEFAULT ARRAY[]::VARCHAR[],
  stock INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create cart_items table
CREATE TABLE IF NOT EXISTS cart_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id VARCHAR(255) NOT NULL,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 1,
  size VARCHAR(50),
  color VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(session_id, product_id, size, color)
);

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id VARCHAR(255) NOT NULL,
  total_price DECIMAL(10, 2) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  customer_email VARCHAR(255),
  customer_name VARCHAR(255),
  shipping_address TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create order_items table
CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id),
  quantity INTEGER NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  size VARCHAR(50),
  color VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_cart_items_session ON cart_items(session_id);
CREATE INDEX IF NOT EXISTS idx_orders_session ON orders(session_id);
CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id);

-- Insert sample products for testing
INSERT INTO products (name, description, price, image_url, category, sizes, colors, stock) VALUES
('Classic T-Shirt', 'Comfortable and versatile classic t-shirt', 29.99, '/images/tshirt.jpg', 'shirts', ARRAY['XS', 'S', 'M', 'L', 'XL'], ARRAY['Black', 'White', 'Navy'], 50),
('Denim Jeans', 'Premium denim jeans with perfect fit', 79.99, '/images/jeans.jpg', 'pants', ARRAY['28', '30', '32', '34', '36'], ARRAY['Dark Blue', 'Light Blue'], 30),
('Summer Dress', 'Light and breathable summer dress', 49.99, '/images/dress.jpg', 'dresses', ARRAY['XS', 'S', 'M', 'L'], ARRAY['Pink', 'Yellow', 'Blue'], 25),
('Cotton Hoodie', 'Cozy cotton hoodie perfect for any season', 59.99, '/images/hoodie.jpg', 'hoodies', ARRAY['S', 'M', 'L', 'XL', 'XXL'], ARRAY['Gray', 'Black', 'Navy'], 40),
('Running Shoes', 'Lightweight running shoes for comfort', 99.99, '/images/shoes.jpg', 'shoes', ARRAY['6', '7', '8', '9', '10', '11', '12'], ARRAY['Black', 'White', 'Red'], 35),
('Leather Jacket', 'Classic leather jacket for a timeless look', 199.99, '/images/jacket.jpg', 'jackets', ARRAY['XS', 'S', 'M', 'L', 'XL'], ARRAY['Black', 'Brown'], 15),
('Casual Shorts', 'Comfortable shorts for summer', 39.99, '/images/shorts.jpg', 'shorts', ARRAY['S', 'M', 'L', 'XL'], ARRAY['Khaki', 'Black', 'Navy'], 45),
('Wool Sweater', 'Warm wool sweater for cold weather', 89.99, '/images/sweater.jpg', 'sweaters', ARRAY['S', 'M', 'L', 'XL'], ARRAY['Cream', 'Gray', 'Navy'], 28);
