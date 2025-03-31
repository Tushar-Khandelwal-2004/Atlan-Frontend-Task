# SQL Query Runner - A Modern Web Application

## Introduction
SQL Query Runner is a sophisticated web application designed to provide a seamless experience for executing and managing SQL queries. Built with React and TypeScript, this application offers a modern, responsive interface with advanced features for query management, data visualization, and performance optimization.

## Features

### 1. Query Management
- **Multiple Query Sections**
  - Saved Queries: Store frequently used queries for quick access
  <div style="width: 300px; margin: auto;">
  <img src="/src/assets/saved.png" alt="Alt text" style="width: 300px;">
</div>

  - Recent Queries: Automatically track and display recently executed queries
  <div style="width: 300px; margin: auto;">
  <img src="/src/assets/recent.png" alt="Alt text" style="width: 300px;">
</div>

  - Favorites: Mark important queries for easy access
  <div style="width: 300px; margin: auto;">
  <img src="/src/assets/fav.png" alt="Alt text" style="width: 300px;">
</div>




- **Query Editor**
  - Syntax highlighting

### 2. Data Visualization
- **Advanced Table Features**
  - Column resizing
  - Sorting capabilities
  - Filtering options
  - Pagination
  - Virtual scrolling for large datasets
  - Infinite scroll support
  ![Alt text](/src/assets/image.png)

- **Export Options**
  - Multiple format support (CSV, JSON, Excel, PDF)
  - Customizable export settings
  - Filtered Data can be exported
  ![Alt text](/src/assets/export.png)

### 3. User Interface
  - Collapsible sidebar
  - Adaptive layout
  - Light mode

  ![Alt text](/src/assets/light.png)

  - Dark mode
  
  ![Alt text](/src/assets/dark.png)

  - Smooth transitions

## Performance Optimization

### 1. Initial Page Load Optimization
- **Code Splitting**
  - Lazy loading of components
  - Minified CSS and JavaScript
  - Optimized images
  - Efficient font loading

### 2. Runtime Performance
- **Virtual Scrolling**
  - Efficient rendering of large datasets
  - Reduced DOM nodes
  - Smooth scrolling experience
- **State Management**
  - Optimized React state updates
  - Memoization of expensive computations
  - Efficient data caching

### 3. Data Handling
- **Local Storage**
  - Persistent query history
  - Efficient data storage
  - Quick data retrieval
- **Query Execution**
  - Asynchronous operations
  - Debounced search
  - Optimized filtering

## Technical Implementation

### 1. Frontend Architecture
- **React with TypeScript**
  - Type-safe development
  - Better code maintainability
  - Enhanced developer experience
- **Styled Components**
  - CSS-in-JS solution
  - Dynamic styling
  - Theme support

### 2. Data Management
- **Table Implementation**
  - TanStack Table integration
  - Custom column management
  - Advanced sorting and filtering
- **Query History**
  - Local storage persistence
  - Efficient data structure
  - Quick access patterns


## Results and Impact

### 1. Performance Metrics
- Initial page load time: < 2 seconds
- Time to interactive: < 3 seconds
- Smooth scrolling with 1000+ rows
- Efficient memory usage
![Alt text](/src/assets/Screenshot%202025-03-31%20161620.png)
### 2. User Experience
- Intuitive interface
- Responsive design
- Smooth transitions
- Accessible components
![Alt text](/src/assets/Screenshot%202025-03-31%20161632.png)
### 3. Development Benefits
- Maintainable codebase
- Scalable architecture
- Easy to extend
- Developer-friendly

## Conclusion
SQL Query Runner demonstrates the power of modern web technologies in creating efficient, user-friendly applications. Through careful optimization and thoughtful feature implementation, I have created a tool that balances functionality with performance. The application serves as a testament to the importance of user experience, performance optimization, and code quality in modern web development.

## Future Enhancements
1. Real-time query execution
2. Advanced query validation
3. Query templates
4. Collaborative features
5. Advanced analytics
6. Custom theme builder
7. Query performance metrics
8. Database connection management

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation
```bash
# Clone the repository
git clone [https://github.com/Tushar-Khandelwal-2004/Atlan-Frontend-Task]

# Install dependencies
npm install

# Start the development server
npm run dev
```

### Usage
1. Select a table from the dropdown
2. Click "Run Query" to execute
3. View results in the table
4. Use the various features to manage and export data

## Contributing
Contributions are welcome! Please feel free to submit a Pull Request.


