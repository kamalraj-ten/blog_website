# blog_website
A project that represents Online Blogging Website for Software Package Development.
This system is similar to the other blogging websites that spread the information and knowledge about the topics that are interesting to the readers.
The website uses the html,css,bootstap and handlebar tools for front end part and odejs, express and hiroku database for back end part.
It includes features like create/edit/delete the blogs, view follow count and blog history for the bloggers.
For the users, they have the ability to view/like/comment a blog, follow the blogger and see their day to day tracking.

Blog website link: https://simple-blog-app-1.herokuapp.com/login

<h3>File Organization</h3>

&emsp;root<br>
&emsp;│&emsp;.gitignore<br>
&emsp;│&emsp;package-lock.json<br>
&emsp;│&emsp;package.json<br>
&emsp;│&emsp;Procfile<br>
&emsp;│&emsp;README.md<br>
&emsp;│&emsp;server.js<br>
&emsp;│<br>
&emsp;│───db<br>
&emsp;│&emsp;&emsp;analytics.js<br>
&emsp;│&emsp;&emsp;auth.js<br>
&emsp;│&emsp;&emsp;database.js<br>
&emsp;│&emsp;&emsp;DBConnect.js<br>
&emsp;│<br>
&emsp;│───public<br>
&emsp;│&emsp;&emsp;├───css<br>
&emsp;│&emsp;&emsp;│&emsp;&emsp;bootstrap.min.css<br>
&emsp;│&emsp;&emsp;│&emsp;&emsp;bootstrap.min.css.map<br>
&emsp;│&emsp;&emsp;│&emsp;&emsp;loginstyle.css<br>
&emsp;│&emsp;&emsp;│&emsp;&emsp;signup.css<br>
&emsp;│&emsp;&emsp;│&emsp;&emsp;styles.css<br>
&emsp;│&emsp;&emsp;│<br>
&emsp;│&emsp;&emsp;├───icons<br>
&emsp;│&emsp;&emsp;│&emsp;&emsp;bg.jpg<br>
&emsp;│&emsp;&emsp;│&emsp;&emsp;check-mark.svg<br>
&emsp;│&emsp;&emsp;│&emsp;&emsp;check.png<br>
&emsp;│&emsp;&emsp;│&emsp;&emsp;user.png<br>
&emsp;│&emsp;&emsp;│<br>
&emsp;│&emsp;&emsp;└───scripts<br>
&emsp;│&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;bootstrap.min.js<br>
&emsp;│&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;bootstrap.min.js.map<br>
&emsp;│&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;categories_toggle.js<br>
&emsp;│&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;loading.js<br>
&emsp;│&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;signup.js<br>
&emsp;│&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;userpage.js<br>
&emsp;│<br>
&emsp;├───routes<br>
&emsp;│&emsp;&emsp;databaseAPI.js<br>
&emsp;│&emsp;&emsp;likeCommentAPI.js<br>
&emsp;│&emsp;&emsp;trackingAPI.js<br>
&emsp;│<br>
&emsp;└───views<br>
&emsp;&emsp;&emsp;│&emsp;&emsp;create_blog.handlebars<br>
&emsp;&emsp;&emsp;│&emsp;&emsp;editBlog.handlebars<br>
&emsp;&emsp;&emsp;│&emsp;&emsp;loading.handlebars<br>
&emsp;&emsp;&emsp;│&emsp;&emsp;login.handlebars<br>
&emsp;&emsp;&emsp;│&emsp;&emsp;mainpage.handlebars<br>
&emsp;&emsp;&emsp;│&emsp;&emsp;signup.handlebars<br>
&emsp;&emsp;&emsp;│&emsp;&emsp;suggestion_page.handlebars<br>
&emsp;&emsp;&emsp;│&emsp;&emsp;userpage.handlebars<br>
&emsp;&emsp;&emsp;│&emsp;&emsp;viewBlog.handlebars<br>
&emsp;&emsp;&emsp;│<br>
&emsp;&emsp;&emsp;└───layouts<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;main.handlebars<br>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;no_nav_main.handlebars<br>
