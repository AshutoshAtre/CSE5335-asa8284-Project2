# CSE 5335 Project 2

This project establishes the client server components of a state-of-the-art web application using node.js, angular.js and REST.

Student Name: Ashutosh Atre
Net ID: 1001178274

### What SQL or NOSQL database did you choose and why?
> I used MongoDB database in this project. It is a NOSQL database. I used mongoDB over the other options because the term 'MEAN stack' itself is compliant in all the aspects. So Node, Angular, Express and MongoDB work seemlessly well and I wanted to leverage this advantage. Also MongoDB is supported by Heroku. 


### What aspect of the implementation did you find easy, if any, and why?
>  I particularly find integration of mongoDB into Node.js very easy. It is seemless and very easy. With the help of Mongoose it is particularly awesome.


### What aspect of the implementation did you find hard, if any, and why?
>  The most hard part for this project was to fetch the data from IMDB and insert into database. I did not want to insert 250 records in my local mongoDB instance and mLab instance as well. I tried to perform web-scrapping on IMDB website, to fetch the list using verious opensource web-scrapping software. But finally, I found out the best option of 'imdbpie' which is a python library. It gave me top 250 movies from the imdb list in one function call. Using python then, I wrote this data into JSON format in a file and then uploaded it into mongoDB instance.  


### If you were to use these technologies professionally, what would be your biggest concern?
>  My biggest concern while using these technologies, professionally would be Node.js. Writing OOP code in javascript is somewhat difficult for me, especially when there are lot of powerful frameworks are out there such as Flask, Django (in Python), Spring, Spring Boot (in Java), Entity framework (in C#) which do this job with perfection and with ease. So writing a complex server side in Node.js would be my biggest concern. Second biggest concern would that be pricing of MongoDB instance.


### What Ubuntu commands are required to deploy and run your server?
>  Following are the steps to execute this project on any machine irrespective of OS. I am assuming Node.js and NPM is already installed. There are no specific commands for ubuntu, if node and npm is already installed.
  1. Copy all the files to a folder. Let's Assume 'project1'
  2. Open Node JS command line
  3. Traverse to the path of 'project1' folder on the disk.
  4. Use this command 'npm install'. This will install all the dependencies.
  5. Use this command to start the server 'node server.js'
  6. Now the web application is accessible at 'localhost:8081'. Open it in any browser.
