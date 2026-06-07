# SE Project Requirements

* The project should be a **web-based** or **mobile application** with a separate frontend and backend part. 

* Students are **free to choose technologies and programming languages** they want to use for both frontend and backend implementation **as long as they can satisfy all requirements**.

* Communication between the frontend and backend parts of the application should be implemented using **RESTful API**, **GraphQL**, **tRPC,** or similar. 

* When working on the frontend part, **make sure that the application is responsive.**

* Students who previously had System Analysis and Design, Web Programming, and Software Project Management **can use or combine previous projects, but it’s not mandatory.** You may continue working on one of your previous projects or choose a new one.

* The project will be done in groups consisting of **two people**. You **can not** do it individually or in groups of three or more\! Write the names of group members [in this document.](https://docs.google.com/spreadsheets/d/1vyoOc5kiwOb7sB2KlCQOyDbOvhrXfecAa-exQGNa_-A/edit?usp=sharing)

  1. If you cannot find a partner, contact the assistants. 

  2. Penalty for doing the project alone or in a group with more than two members **is \-60% of the project grade.**

  3. A **maximum of two teams** can have the **same topic.** In this case, **they MUST choose different approaches,** otherwise **both teams will get a zero.** 

  4. **Only submissions on time via LMS will be accepted.**

* **There will be three submissions via the LMS, which are described in detail below.**

* [The following template](https://docs.google.com/document/d/1iDcEjlbuGmtUkG5srQ31mJIvGIlqi4q-gV2XOERO0QQ/edit?tab=t.0) should be used when preparing the project documentation. While the template includes general guidelines, please ensure that you follow the **full requirements specified for each milestone** below.

## **Project Deadlines**

### First Milestone:

* The purpose of this milestone is to start thinking about how you are going to implement your project by applying the knowledge from the System Analysis and Design and Software Project Management courses.   
* Your submission should contain the following parts:

1. Create a **high-level plan** that covers all versions of the project. This **will vary based on your approach to the project.**  
   1. If you are planning to do plan-driven development for your project, then you need to create a Gantt chart and Risk analysis.   
      1. For the Gantt chart, you can create the WBS first and then apply the chart.   
      2. For the Risk analysis, you can list all risks and then create risk plans/strategies.   
   2. If you are planning to do agile development for your project, then you need to create a Product Roadmap and a Release plan.   
   3. You will need to have **at least 2 releases.** You can have more releases, but they need to be documented. (go to the first bullet point in the **General Information** section to read more about this)

2. Write **detailed** user stories for functional and non-functional requirements. (minimum 25 for functional, and 3 for non-functional requirements).  
   1. **Do not go over the limit of 35** user stories in total.   
   2. Each user story **should have both the statement and the acceptance criteria.**  
   3. A user story without any of these two elements **is not complete.**

3. Draw activity and sequence UML diagrams and a class diagram for your project that covers the mentioned requirements.  You should **have 3 \- 5 diagrams for activity and sequence diagrams each,** and **one diagram for a class diagram.**  
   1. **Registration, Login, and Logout or any other common functionality diagram will not be accepted.** Focus on diagrams that showcase your project's main functionalities.   
   2. Make sure to include **at least one example of aggregation and composition** inside the class diagram.   
   3. Relations inside of the class diagram should **have relationship names and multiplicity.**  
   4. **Include at least one fragment operator in at least two sequence diagrams.**

4. Submit to the LMS using the template for the Project Document as a PDF. 

   **DEADLINE: Sunday, 23.59h 5th April 2026**

### Second Milestone:

1. **Add your GitHub link** to the documentation. Add us as **collaborators on the Github repository**. (Ajla115)

2. Create an ER diagram for the database with **at least 3** different entities (e.g., Users, Students, Exams,...). The ER diagram **should be added** as an image to the GitHub repository.

3. Create a branch on GitHub for the work on this milestone. When you are done with everything, **merge alone with the main branch without requesting a review.** 

4. **Push to GitHub code for basic CRUD operations.**

5. Even though you are free to choose the technology for your projects, you will have to follow the **coding standards** for the technology or language you use, in both the backend and frontend.

6. The second submission should include the **first version (initial release)** of the project published on GitHub.  
   * The implemented features in this first release **must be aligned with the first release version defined in the Product Roadmap, or with a specific deadline indicated in the Gantt Chart.**  
   * This release may include:   
     * Only backend implementation, or   
     * Only frontend implementation, or  
     * A partial full application intended only for the customer side (no admin functionality at this stage).  
   * The release should demonstrate:  
     * Some working core features,  
     * Basic or partially implemented API calls, where applicable.  
   * The goal of the first release is to deliver a completed initial part of the application.  
   * At this stage, the application does not need to be fully functional.

7. **Finish the following part** of the Project Documentation:  
   * Project Structure ( Technologies \- Backend, Frontend, Database Entites, external API Integration (if any))

8. Push your code to GitHub, merge with the main, create a release/version and submit the updated documentation version to the LMS.

   * Depending on what you implement for the **first release on GitHub**, start thinking about the **architectural patterns** and **design patterns** that will be needed for the entire application.

   * If possible and if you choose to do so, you may **implement these patterns already for the second milestone** and complete the corresponding part of the documentation (**Architectural and Design Patterns**).

   * You will need to implement **at least 1 architectural and 2 design patterns.** Implemented patterns should solve a specific problem in your project, **not just be there for presentation.** However, **this is not mandatory for Milestone 2**.

   * Make sure that **communication between the frontend and backend** parts of the application is implemented using **RESTful APIs, GraphQL, tRPC, or similar approaches**.

   * When working on the **frontend part**, ensure that the application is **responsive across different screen sizes**.  
     **DEADLINE: Tuesday 23.59h, 5th of  May 2026**

### Third Milestone:

1. **Finish the whole application.** All functionalities specified in the project document should be **implemented and work as expected.**

2. Make sure you have **at least one architectural and at least two design patterns** implemented in your code. Implemented patterns **should solve a specific problem in your project, not just be there for presentation.**

3. The project should have at least **5 meaningful tests** that will **test the main functionalities of your application.** These can be unit tests on the backend or automation testing using Selenium. Tests should be added to GitHub, as well. 

4. For the third milestone, everything should be done on a **second GitHub branch and merged with the main branch after everything is finished. Also, the second release/version should be created.** 

5. The project should be **deployed** and **publicly available** as of the last deadline. This can be done via a GitHub [Education Pack](https://education.github.com/) or some other third-party solution.

6. **Finish the last part of the documentation:**  
   * Architectural and Design Patterns (if not done for the second milestone)  
   * Coding Standards  
   * Project Functionalities and Screenshots  
   * Tests  
   * Individual Contributions  
   * Add the deployment link to the documentation

7. Push your code to GitHub, merge with the main, create a release/version and submit the updated documentation version to the LMS.

   **DEADLINE: Sunday, 23.59h 7th June 2026**

## **General Information**

* Each project must include **at least two releases** and **two corresponding branches on GitHub**. If a project contains more than two releases, the number of GitHub branches must match the number of releases. **All releases must be clearly presented and explained in the project documentation**, regardless of the planning approach used. For example, if you use a product roadmap and release plan and define four releases, all four releases must be shown and described in both the roadmap and the release plan. Likewise, if you use **Gantt charts and a Work Breakdown Structure (WBS)**, you must define **work chunks and deadlines for all four releases, not just two.**

* Every project must have a **GitHub repository,** and the activity of each group member will be monitored and graded according to contribution. You should commit regularly to GitHub.

* **No submission sent via email will be accepted. Submissions should only be submitted on time through the appropriate option on LMS.**

