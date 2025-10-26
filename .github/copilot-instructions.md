# AI Assistant Instructions for Portfolio Website

This document provides essential context for AI agents working with this codebase.

## Project Overview
- Personal portfolio website showcasing engineering projects and creative work
- Static HTML/CSS website using Bootstrap for responsive design
- Dark theme with consistent styling across pages

## Directory Structure
```
/
├── index.html          # Landing page with intro and experience
├── Engineering.html    # Projects showcase page
├── Creatives.html     # Photography/videography portfolio
├── about.html         # Personal information
├── blog.html         # Blog section
├── images/           # Image assets
└── project pages     # Individual project detail pages (e.g., bci.html, mars.html)
```

## Key Design Patterns & Conventions

### 1. Page Structure
- Each page follows a consistent template:
  ```html
  <!DOCTYPE html>
  <html>
    <head>
      <!-- Bootstrap + Custom styles -->
    </head>
    <body>
      <!-- Navigation header -->
      <!-- Main content -->
      <!-- Footer with social links -->
    </body>
  </html>
  ```

### 2. Styling Conventions
- Dark theme colors:
  - Background: `rgb(15, 11, 11)`
  - Text: White/grey variations
- Typography:
  - Headers: 'Teko' font family
  - Body text: 'Noto Sans Japanese' for main content
  - Navigation: 'Teko' at 20px
- Consistent container max-width and margins

### 3. Component Patterns
- Project cards use:
  ```html
  <div class="container col-xxl-8 px-2 py-2" style="height: 700px; background-image: url('...');">
    <!-- Project content -->
  </div>
  ```
- Social icons are SVG-based using consistent styling

## Common Tasks

### Adding New Projects
1. Create new project page following existing templates
2. Add project card to `Engineering.html` using standard container pattern
3. Include relevant images in `/images` directory
4. Link from main navigation if needed

### Styling Updates
- Main styles are inline within each page
- Update common elements across all pages:
  - Navigation styles
  - Footer layout
  - Container widths
  - Font styles

### Content Management
- Project images should be optimized before adding to `/images`
- Maintain consistent header hierarchy
- Keep social links updated in navigation and footer

## Integration Points
- Bootstrap 5.3.3 for layout and components
- Google Fonts for typography
- Tally.so for contact form embedding
- Social media profile links

## Development Workflow
1. Test all HTML changes in browser for responsive behavior
2. Verify image paths and links before committing changes
3. Maintain consistent spacing and indentation in HTML
4. Update copyright year in footer when necessary

Remember to maintain the established visual hierarchy and responsive behavior when making changes to any page.