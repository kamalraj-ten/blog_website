# blog_website
A project that represents Online Blogging Website for Software Package Development.
This system is similar to the other blogging websites that spread the information and knowledge about the topics that are interesting to the readers.
The website uses the html,css,bootstap and handlebar tools for front end part and odejs, express and hiroku database for back end part.
It includes features like create/edit/delete the blogs, view follow count and blog history for the bloggers.
For the users, they have the ability to view/like/comment a blog, follow the blogger and see their day to day tracking.

<h3>File file organization</h3>

│   .gitignore
│   package-lock.json
│   package.json
│   Procfile
│   README.md
│   server.js
│
|───db
│       analytics.js
│       auth.js
│       database.js
│       DBConnect.js
│
├───public
│   ├───css
│   │       bootstrap.min.css
│   │       bootstrap.min.css.map
│   │       loginstyle.css
│   │       signup.css
│   │       styles.css
│   │
│   ├───icons
│   │       bg.jpg
│   │       check-mark.svg
│   │       check.png
│   │       user.png
│   │
│   └───scripts
│           bootstrap.min.js
│           bootstrap.min.js.map
│           categories_toggle.js
│           loading.js
│           signup.js
│           userpage.js
│
├───routes
│       databaseAPI.js
│       likeCommentAPI.js
│       trackingAPI.js
│
└───views
    │   create_blog.handlebars
    │   editBlog.handlebars
    │   loading.handlebars
    │   login.handlebars
    │   mainpage.handlebars
    │   signup.handlebars
    │   suggestion_page.handlebars
    │   userpage.handlebars
    │   viewBlog.handlebars
    │
    └───layouts
            main.handlebars
            no_nav_main.handlebars

