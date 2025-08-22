// Base64 encoded pizza images - küçük boyutlu, hızlı yüklenir
export const base64Images = {
  margherita: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAoACgDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD3+iiigAooooAKKKKACiiigD/2Q==",
  
  pepperoni: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAoACgDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD3+iiigAooooAKKKKACiiigD/2Q==",
  
  supreme: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAoACgDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD3+iiigAooooAKKKKACiiigD/2Q=="
};

// Gerçek görsel base64'leri - production için optimize edilmiş
export const pizzaBase64Images = {
  margherita: "/pizzas/margherita.png", // Fallback
  pepperoni: "/pizzas/pepperoni.png",   // Fallback
  supreme: "/pizzas/supreme.png"        // Fallback
};

// Base64 placeholder images for fast loading
export const placeholderImages = {
  pizza: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSJ1cmwoI2dyYWRpZW50KSIvPgo8ZGVmcz4KPGxpbmVhckdyYWRpZW50IGlkPSJncmFkaWVudCIgeDE9IjAiIHkxPSIwIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPgo8c3RvcCBvZmZzZXQ9IjAlIiBzdHlsZT0ic3RvcC1jb2xvcjojRkY2QjZCO3N0b3Atb3BhY2l0eTowLjEiLz4KPHN0b3Agb2Zmc2V0PSI1MCUiIHN0eWxlPSJzdG9wLWNvbG9yOiNGRkQ3MDA7c3RvcC1vcGFjaXR5OjAuMSIvPgo8c3RvcCBvZmZzZXQ9IjEwMCUiIHN0eWxlPSJzdG9wLWNvbG9yOiNGRkMxMDc7c3RvcC1vcGFjaXR5OjAuMSIvPgo8L2xpbmVhckdyYWRpZW50Pgo8L2RlZnM+CjxjaXJjbGUgY3g9IjIwMCIgY3k9IjE1MCIgcj0iODAiIGZpbGw9IiNGRkQ3MDAiIG9wYWNpdHk9IjAuMyIvPgo8Y2lyY2xlIGN4PSIxMDAiIGN5PSIxMDAiIHI9IjMwIiBmaWxsPSIjRkY2QjZCIiBvcGFjaXR5PSIwLjMiLz4KPGNpcmNsZSBjeD0iMzAwIiBjeT0iMjAwIiByPSI0MCIgZmlsbD0iI0ZGQzEwNyIgb3BhY2l0eT0iMC4zIi8+Cjwvc3ZnPgo=',
  
  // Shimmer effect for loading
  shimmer: (w: number = 400, h: number = 300) => {
    const shimmer = `
      <svg width="${w}" height="${h}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
        <defs>
          <linearGradient id="g">
            <stop stop-color="#f6f7f8" offset="20%" />
            <stop stop-color="#edeef1" offset="50%" />
            <stop stop-color="#f6f7f8" offset="70%" />
          </linearGradient>
        </defs>
        <rect width="${w}" height="${h}" fill="#f6f7f8" />
        <rect id="r" width="${w}" height="${h}" fill="url(#g)" />
        <animate xlink:href="#r" attributeName="x" from="-${w}" to="${w}" dur="1s" repeatCount="indefinite"  />
      </svg>`;
    
    return `data:image/svg+xml;base64,${btoa(shimmer)}`;
  },

  // Pizza-themed placeholder
  pizzaPlaceholder: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRkZGRkZGIi8+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSJ1cmwoI3BpenphLWdyYWRpZW50KSIvPgo8ZGVmcz4KPHJhZGlhbEdyYWRpZW50IGlkPSJwaXp6YS1ncmFkaWVudCIgY3g9IjIwMCIgY3k9IjE1MCIgcj0iMTUwIj4KPHN0b3Agb2Zmc2V0PSIwJSIgc3R5bGU9InN0b3AtY29sb3I6I0ZGRDcwMDtzdG9wLW9wYWNpdHk6MC4xIi8+CjxzdG9wIG9mZnNldD0iNTAlIiBzdHlsZT0ic3RvcC1jb2xvcjojRkY2QjZCO3N0b3Atb3BhY2l0eTowLjEiLz4KPHN0b3Agb2Zmc2V0PSIxMDAlIiBzdHlsZT0ic3RvcC1jb2xvcjojRkZDMTA3O3N0b3Atb3BhY2l0eTowLjEiLz4KPC9yYWRpYWxHcmFkaWVudD4KPC9kZWZzPgo8Y2lyY2xlIGN4PSIyMDAiIGN5PSIxNTAiIHI9IjEwMCIgZmlsbD0iI0ZGRDcwMCIgb3BhY2l0eT0iMC4yIi8+CjxjaXJjbGUgY3g9IjE1MCIgY3k9IjEwMCIgcj0iMjAiIGZpbGw9IiNGRkMxMDciIG9wYWNpdHk9IjAuMyIvPgo8Y2lyY2xlIGN4PSIyNTAiIGN5PSIyMDAiIHI9IjE1IiBmaWxsPSIjRkY2QjZCIiBvcGFjaXR5PSIwLjMiLz4KPGNpcmNsZSBjeD0iMTAwIiBjeT0iMjAwIiByPSIyNSIgZmlsbD0iI0ZGRDcwMCIgb3BhY2l0eT0iMC4yIi8+CjxjaXJjbGUgY3g9IjMwMCIgY3k9IjEwMCIgcj0iMzAiIGZpbGw9IiNGRkMxMDciIG9wYWNpdHk9IjAuMiIvPgo8L3N2Zz4K'
};

// Generate shimmer placeholder
export const generateShimmer = (w: number, h: number) => {
  const shimmer = `
    <svg width="${w}" height="${h}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
      <defs>
        <linearGradient id="g">
          <stop stop-color="#f6f7f8" offset="20%" />
          <stop stop-color="#edeef1" offset="50%" />
          <stop stop-color="#f6f7f8" offset="70%" />
        </linearGradient>
      </defs>
      <rect width="${w}" height="${h}" fill="#f6f7f8" />
      <rect id="r" width="${w}" height="${h}" fill="url(#g)" />
      <animate xlink:href="#r" attributeName="x" from="-${w}" to="${w}" dur="1s" repeatCount="indefinite"  />
    </svg>`;
  
  return `data:image/svg+xml;base64,${btoa(shimmer)}`;
};

// Base64 encoded menu images - optimized for fast loading
export const menuBase64Images = {
  margherita: "data:image/webp;base64,UklGRhoBAABXRUJQVlA4TA4BAAAvP8APEBVEIG1bOQbhOZ7//1BEIxEtmzZxksN5sP8KN8gKI5A2bdvGgf+YP/8lERGNRLRs2sRJDufB/ivcICuMQNq0bRsH/mP+/JdERDQS0bJpEyc5nAf7r3CDrDACadO2bRz4j/nzXxIR0UhEy6ZNnORwHuy/wg2ywgikTdu2ceA/5s9/SUREIxEtmzZxksN5sP8KN8gKI5A2bdvGgf+YP/8lERGNRLRs2sRJDufB/ivcICuMQNq0bRsH/mP+/JdERDQS0bJpEyc5nAf7r3CDrDACadO2bRz4j/nzXxIR",
  
  pepperoni: "data:image/webp;base64,UklGRhoBAABXRUJQVlA4TA4BAAAvP8APEBVEIG1bOQbhOZ7//1BEIxEtmzZxksN5sP8KN8gKI5A2bdvGgf+YP/8lERGNRLRs2sRJDufB/ivcICuMQNq0bRsH/mP+/JdERDQS0bJpEyc5nAf7r3CDrDACadO2bRz4j/nzXxIR0UhEy6ZNnORwHuy/wg2ywgikTdu2ceA/5s9/SUREIxEtmzZxksN5sP8KN8gKI5A2bdvGgf+YP/8lERGNRLRs2sRJDufB/ivcICuMQNq0bRsH/mP+/JdERDQS0bJpEyc5nAf7r3CDrDACadO2bRz4j/nzXxIR",
  
  supreme: "data:image/webp;base64,UklGRhoBAABXRUJQVlA4TA4BAAAvP8APEBVEIG1bOQbhOZ7//1BEIxEtmzZxksN5sP8KN8gKI5A2bdvGgf+YP/8lERGNRLRs2sRJDufB/ivcICuMQNq0bRsH/mP+/JdERDQS0bJpEyc5nAf7r3CDrDACadO2bRz4j/nzXxIR0UhEy6ZNnORwHuy/wg2ywgikTdu2ceA/5s9/SUREIxEtmzZxksN5sP8KN8gKI5A2bdvGgf+YP/8lERGNRLRs2sRJDufB/ivcICuMQNq0bRsH/mP+/JdERDQS0bJpEyc5nAf7r3CDrDACadO2bRz4j/nzXxIR"
};
