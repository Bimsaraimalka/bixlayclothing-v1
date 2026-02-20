export const blogPosts = [
  {
    slug: 'welcome-to-the-bixlay-blog',
    title: 'Welcome to the Bixlay Blog',
    excerpt: 'A place for style inspiration, care tips, and updates from the Bixlay team. We’re glad you’re here.',
    date: '2025-02-15',
    body: `We’re excited to launch the Bixlay blog. Here you’ll find style tips, care guides for your favourite pieces, and updates from our team.

We believe great clothing is more than fabric – it’s part of how you show up every day. So we’ll share practical advice and a bit of inspiration to help you get the most out of your wardrobe.

Thanks for being here. If there’s something you’d like us to cover, drop us a line at hello@bixlay.com.`,
  },
  {
    slug: 'how-to-care-for-your-cottons',
    title: 'How to Care for Your Cottons',
    excerpt: 'Simple steps to keep your favourite cotton pieces looking and feeling great wash after wash.',
    date: '2025-02-10',
    body: `Cotton is a wardrobe staple for good reason: it’s breathable, comfortable, and versatile. With a little care, your cotton pieces can last for years.

**Washing:** Turn items inside out before washing to protect the outer surface. Use cold or cool water and a gentle cycle. Avoid overloading the machine so clothes have room to move.

**Drying:** Air-drying is gentlest and helps prevent shrinkage. If you use a tumble dryer, choose a low heat setting and remove items while still slightly damp.

**Ironing:** Iron while the fabric is slightly damp, or use the steam setting, for a smooth finish without high heat.

Storing cotton in a cool, dry place away from direct sunlight will help keep colours and fibres in good shape.`,
  },
  {
    slug: 'building-a-versatile-wardrobe',
    title: 'Building a Versatile Wardrobe',
    excerpt: 'A few well-chosen basics can take you from casual to polished. Here’s how we think about versatility.',
    date: '2025-02-01',
    body: `A versatile wardrobe isn’t about having more clothes – it’s about choosing pieces that work in many situations.

Start with neutral basics in colours you wear most. Think solid tees, well-fitting trousers, and a couple of layers like a shirt or lightweight jacket. These can be mixed and matched for different looks without buying new outfits every time.

Quality over quantity matters. One well-made piece that fits well will do more for you than several items you rarely wear. At Bixlay, we focus on cuts and fabrics that work for everyday wear and can be dressed up when needed.

Build slowly, choose what you actually enjoy wearing, and your wardrobe will start to feel more cohesive and easier to manage.`,
  },
] as const

export type BlogPostSlug = (typeof blogPosts)[number]['slug']
