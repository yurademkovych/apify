# Quiz

## Task 2

### Where and how can you use JQuery with the SDK?

> To add jQuery, all we need to do is turn on Inject jQuery under INPUT Options. 
> This will add a context.jQuery function that you can use.
> Now that's out of the way, let's open one of the actor detail pages in the Store, 
> for example the Web Scraper page and use our DevTools-Fu to scrape some data.

### What is the main difference between Cheerio and JQuery?

> Developers describe cheerio as "Fast, flexible, and lean implementation of core jQuery". Fast, flexible,
> and lean implementation of core jQuery designed specifically for the server. On the other hand, 
> jQuery is detailed as "The Write Less, Do More, JavaScript Library". jQuery is a cross-platform JavaScript
> library designed to simplify the client-side scripting of HTML.

> Cheerio and jQuery can be primarily classified as "Javascript UI Libraries" tools.

> jQuery is an open source tool with 53.9K GitHub stars and 19.5K GitHub forks. Here's a link to jQuery's open source repository on GitHub.

### When would you use CheerioCrawler and what are its limitations?

> Provides a framework for the parallel crawling of web pages using plain HTTP requests and cheerio HTML parser. 
> The URLs to crawl are fed either from a static list of URLs or from a dynamic queue of URLs enabling recursive
> crawling of websites.

> Since CheerioCrawler uses raw HTTP requests to download web pages, it is very fast and efficient on data 
> bandwidth. However, if the target website requires JavaScript to display the content, you might need to use
> PuppeteerCrawler or PlaywrightCrawler instead, because it loads the pages using full-featured headless Chrome 
> browser.

> CheerioCrawler downloads each URL using a plain HTTP request, parses the HTML content using Cheerio and then
> invokes the user-provided CheerioCrawlerOptions.handlePageFunction to extract page data using a jQuery-like 
> interface to the parsed HTML DOM.

> The source URLs are represented using Request objects that are fed from RequestList or RequestQueue instances
> provided by the CheerioCrawlerOptions.requestList or CheerioCrawlerOptions.requestQueue constructor options,
> respectively.

> If both CheerioCrawlerOptions.requestList and CheerioCrawlerOptions.requestQueue are used, the instance first 
> processes URLs from the RequestList and automatically enqueues all of them to RequestQueue before it starts
> their processing. This ensures that a single URL is not crawled multiple times.

> The crawler finishes when there are no more Request objects to crawl.

> CheerioCrawler downloads the web pages using the utils.requestAsBrowser() utility function.

> By default, CheerioCrawler only processes web pages with the text/html and application/xhtml+xml MIME content
> types (as reported by the Content-Type HTTP header), and skips pages with other content types. If you want the
> crawler to process other content types, use the CheerioCrawlerOptions.additionalMimeTypes constructor option.
> Beware that the parsing behavior differs for HTML, XML, JSON and other types of content. For details, see 
> CheerioCrawlerOptions.handlePageFunction.

> New requests are only dispatched when there is enough free CPU and memory available, using the functionality
> provided by the AutoscaledPool class. All AutoscaledPool configuration options can be passed to the
> autoscaledPoolOptions parameter of the CheerioCrawler constructor. For user convenience, the minConcurrency and 
> maxConcurrency AutoscaledPool options are available directly in the CheerioCrawler constructor.

### What are the main classes for managing requests and when and why would you use one instead of another?

> `requestQueue.addRequest(requestLike, [options])`
> **Adds a request to the queue.**
>
> If a request with the same uniqueKey property is already present in the queue, it will not be updated. You can find out whether this happened from the resulting QueueOperationInfo object.
>
> To add multiple requests to the queue by extracting links from a webpage, see the utils.enqueueLinks() helper function.
>
> `requestQueue.getRequest(id)`
> **Gets the request from the queue specified by ID.**
>
> `requestQueue.fetchNextRequest()`
> **Returns a next request in the queue to be processed, or null if there are no more pending requests.**
>
> Once you successfully finish processing of the request, you need to call RequestQueue.markRequestHandled() to mark the request as handled in the queue. If there was some error in processing the request, call RequestQueue.reclaimRequest() instead, so that the queue will give the request to some other consumer in another call to the fetchNextRequest function

### How can you extract data from a page in Puppeteer without using JQuery?

> Using `page.$eval` function.

### What is the default concurrency/parallelism the SDK uses?

> Manages a pool of asynchronous resource-intensive tasks that are executed in parallel. The pool only starts new tasks if there is enough free CPU and memory available and the Javascript event loop is not blocked. 

## Task 3

### How do you allocate more CPU for your actor run?

> Apify actors are most commonly written in Node.js, which uses a single process thread. Unless you use external
binaries such as the Chrome browser, Puppeteer, or other multi-threaded libraries you will not gain more CPU power from assigning your actor more than 4 GB of memory because Node.js cannot use more than 1 core.
>
> In other words, giving a simple, Cheerio-based crawler 16GB of memory (4 CPU cores) will not make it faster
> because these crawlers simply cannot use more than 1 CPU core.

### How can you get the exact time when the actor was started from within the running actor process?

> By using `process.env.APIFY_STARTED_AT`

### Which are the default storages an actor run is allocated (connected to)?

> The data is stored either on local disk to a directory defined by the APIFY_LOCAL_STORAGE_DIR environment variable, or on the Apify platform under the user account identified by the API token defined by the APIFY_TOKEN environment variable. If neither of these variables is defined, by default Apify SDK sets APIFY_LOCAL_STORAGE_DIR to ./apify_storage in the current working directory and prints a warning.

### Can you change the memory allocated to a running actor?

> Yes — in the web app settings or in the API call props using `process.env.APIFY_MEMORY_MBYTES`.

### How can you run an actor with Puppeteer in a headful (non-headless) mode?

> To launch puppeteer in headless mode add the option `headless:true` in `launchContext`.

### Imagine the server/instance the container is running on has a 32 GB, 8-core CPU. What would be the most performant (speed/cost) memory allocation for CheerioCrawler? (Hint: NodeJS processes cannot use user-created threads)

>  If container is running on has a 32 GB, 8-core CPU, it will not make it faster because these crawlers simply cannot use more than 1 CPU core.

### What is the difference between RUN and CMD Dockerfile commands?

> RUN and CMD are both Dockerfile instructions. RUN lets you execute commands inside of your Docker image. These commands get executed once at build time and get written into your Docker image as a new layer. CMD lets you define a default command to run when your container starts.


### Does your Dockerfile need to contain a CMD command (assuming we don't want to use ENTRYPOINT which is similar)? If yes or no, why?

> It doesn't have to because, for example, docker-compose can assign a CMD command for the Docker container. Also, base image may define the CMD instruction.

### How does the FROM command work and which base images Apify provides?

> Browsers are pretty big, so we try to provide a wide variety of images to suit your needs. Here's a full list of our Docker images.

> * apify/actor-node
> * apify/actor-node-puppeteer-chrome
> * apify/actor-node-playwright
> * apify/actor-node-playwright-chrome
> * apify/actor-node-playwright-firefox
> * apify/actor-node-playwright-webkit

## Task 4

### Do you have to rebuild an actor each time the source code is changed?

> If the source code of an actor is hosted in a Git repository, it is possible to set up integration so that on every push to the Git repository the actor is automatically rebuilt. So, now your actor should automatically rebuild on every push to the GitHub repository.

### What is the difference between pushing your code changes and creating a pull request?

> In a general scenario many developers work on a repository and not all of them have push access to master. This means they cannot push the code directly to master. Hence, developers push the code to a different branch and then raise a pull request to merge the changes to master. An administrator then reviews the code changes in the pull request and then approves the request and merges the changes to master if the change looks good.


### How does the apify push command work? Is it worth using, in your opinion?

> This command uploads your project to the Apify cloud and builds an actor from it.

## Task 5

### What is the relationship between actor and task?

> Actor Tasks help you prepare the configuration of an actor to perform a specific job (think of it as giving your actor a screenplay). Tasks enable you to create multiple configurations for a single Actor and then run the selected configuration directly from the Apify platform, schedule or API.

### What are the differences between default (unnamed) and named storage? Which one would you choose for everyday usage?

> All storages are created without a name (with only an ID). ... Named and unnamed storages are the same in all regards except their retention period. The only difference is that named storages make it easier to verify you are using the correct store.

### What is the relationship between the Apify API and the Apify client? Are there any significant differences?

> Apify-client is the official library to access Apify API from your JavaScript applications. It runs both in Node.js and browser and provides useful features like automatic retries and convenience functions that improve the experience of using the Apify API.

### Is it possible to use a request queue for deduplication of product IDs? If yes, how would you do that?

> Yes, it's possible. We just need to insert ` `${variable}` ` insted of id.

### What is data retention and how does it work for all types of storage (default and named)?

> Unnamed storages expire after 14 days unless otherwise specified.
>
> Named storages are retained indefinitely. You can edit your storages' names in the Apify app or using the access methods above.

### How do you pass input when running an actor or task via the API?

> By creating or editing the INPUT.json file in the key-value store. Using a POST payload when running the actor using the Apify API. 

## Task 6

### What types of proxies does the Apify Proxy include? What are the main differences between them?

> Datacenter proxy – the fastest and cheapest option, it uses data centers to mask your IP address. Chance of blocking due to other users' activity.
>
> Residential proxy – IP addresses located in homes and offices around the world. These IPs have the lowest chance of blocking. 
>
> Google SERP proxy – download and extract data from Google Search engine result pages (SERPs). You can select country and language to get localized results.

### Which proxies (proxy groups) can users access with the Apify Proxy trial? How long does this trial last?

> Users can access with the Apify Proxy trial proxies such as: **BUYPROXIES94952**, **GOOGLE_SERP** and **StaticUS3**. Usage cycle of free trial is 30 days.

### How can you prevent a problem that one of the hardcoded proxy groups that a user is using stops working (a problem with a provider)? What should be the best practices?

> Now we are able to retry bad requests and eventually unless all of our proxies get banned, we should be able to successfully crawl what we want. The problem is that it takes too long and our log is full of errors. Fortunately, we can overcome this with proxy sessions (look at the proxy and SDK documentation for how to use them in your actors.)
>
> First we define sessions  object at the top of our code (in global scope) to hold the state of our working sessions.
>
> `let sessions;`
>
> Then we need to define an interval that will ensure our sessions are periodically saved to the key-value store, so if the actor restarts, we can load them.
>
> And inside our main function, we load the sessions the same way we load an input. If they were not saved yet (the actor was not restarted), we instantiate them as an empty object.
>
> Now let's get to the algorithm that will define which sessions to pick for a request. There are many ways to do this and this is by no means the ideal way, so I encourage you to find a more intelligent algorithm and paste it into the comments of this article.
>
> This function takes sessions  as an argument and returns a session  object which will either be a random object from sessions  or a new one with random user agent.
>
> Then we only need to add the session if the request was successful or remove it if it was not. It doesn't matter if we add the same session twice or delete a non-existent session (because of how JavaScript objects work).
>
> After success:
> `sessions[session.name] = session;`
>
> After failure :
> `(captcha, blocked request, etc.):`
> `delete sessions[session.name]` 
>
> **Things to consider:**
>
> * Since the good and bad proxies are getting filtered over time, this solution only makes sense for crawlers with at least hundreds of requests.
>
> * This solution will not help you if you simply don't have enough proxies for your job. It can even get your proxies banned faster (since the good ones will be used more often), so you should be cautious about the speed of your crawl.
>
> * If you are more concerned about the speed of your crawler and less about banning proxies, set the maxSessions parameter of pickSession function to a number relatively lower to your total number of proxies. If on the other hand, keeping your proxies alive is more important, set maxSessions  relatively higher so you will always pick new proxies.
>
> * Since sessions only last 24 hours, if you have bigger intervals between your crawler runs, they will start fresh each time.

### Does it make sense to rotate proxies when you are logged in?

> The main goal of the rotation process is to imitate a user other from blocked, so the answer is no, because it will be unacceptable behaviour of basic user. User can't log in from one IP and does some actions on site from another IP.
But just in some weird cases, some sites will block the IP but not the account so you can/need to rotate even under login. That is really just the last solution.

### Construct a proxy URL that will select proxies only from the US (without specific groups).

> http://\<session>,country-US:\<password>@proxy.apify.com:8000.
You can use a session pool for rotating the proxy IPs. You can select proxies from a specific country by passing a countryCode parameter to the proxy config.
Puppeteer rotates proxy/IP only after the browser changes (not a single page). So by default, it will use the same IP for 100 requests, unlike Cheerio.

### What do you need to do to rotate proxies (one proxy usually has one IP)? How does this differ for Cheerio Scraper and Puppeteer Scraper?

> To work around IP address-based blocking, web scrapers can rotate IP addresses from which they send the requests to target websites. This can be done by using a pool of proxy servers by assigning each request another proxy server from the pool and thus making it look like a request coming from another user. The proxies can be selected either randomly or in round-robin fashion.
>
> This method's effectiveness depends on various factors such as the number of web pages that are being scraped, the sophistication of the scraping protection and the number and type of proxies. If you send too many requests from a single proxy in too short a period of time, the proxy might get “burned”, which means all further requests from it are blocked.
>
> For successful large-scale scrapes, it is essential to have a sufficient pool of proxies and to time the workload to maximize the scraping throughput while not burning your proxies.
>
> Apify Proxy enables you to do just this using a pool of datacenter and residential proxies.

### Try to set up the Apify Proxy (using any group or auto) in your browser. This is useful for testing how websites behave with proxies from specific countries (although most are from the US). You can try Switchy Omega extension but there are many more. Were you successful?

> Yes, I successfully configured the proxy through the Switchy Omega and succeeded.

### Name a few different ways a website can prevent you from scraping it.

> * IP address-based blocking
> * IP rate limiting
> * HTTP request analysis
> * User behavior analysis
> * Browser fingerprinting
> * Combinations of the above techniques
> * Reducing blocking with shared IP address emulation.

### Do you know any software companies that develop anti-scraping solutions? Have you ever encountered them on a website.

> **IP address-based blocking**
> A popular option some websites use is blocking access based on the IP range your address belongs to. This kind of protection aims to reduce the amount of non-human traffic. For instance, websites will deny access to ranges of Amazon Web Services's IP addresses and other commonly known ranges.
>
> **Bypassing IP address-based blocking**
> To work around IP address-based blocking, web scrapers can rotate IP addresses from which they send the requests to target websites. This can be done by using a pool of proxy servers by assigning each request another proxy server from the pool and thus making it look like a request coming from another user. The proxies can be selected either randomly or in round-robin fashion.
>
> This method's effectiveness depends on various factors such as the number of web pages that are being scraped, the sophistication of the scraping protection and the number and type of proxies. If you send too many requests from a single proxy in too short a period of time, the proxy might get “burned”, which means all further requests from it are blocked.
>
> For successful large-scale scrapes, it is essential to have a sufficient pool of proxies and to time the workload to maximize the scraping throughput while not burning your proxies.
>
> Apify Proxy enables you to do just this using a pool of datacenter and residential proxies.
>
> **IP rate limiting**
> When crawling a website, you’ll typically send many more requests from a single IP address than a human user could generate over the same period. Websites can easily monitor how many requests they receive from a single IP address. If the number of requests exceeds a certain limit, websites can block that IP address or make you pass a CAPTCHA test.
>
> **Bypassing IP rate limiting**
> There are two ways to work around rate limiting. One option is to limit how many pages on a single site you scrape concurrently, and possibly even introduce delays (after reaching the original limit). The other is to use proxy servers and rotate IP addresses after a certain number of requests.
>
> To lower the concurrency when using the Apify SDK, just pass the maxConcurrency option to your crawler's setup. If you use actors from Apify Store, you can usually set the maximum concurrency in the actor's input.
>
> **HTTP request analysis**
> Each HTTP request sent from a client to a web server contains a lot of hidden information such as HTTP headers, client IP address, SSL/TLS version or a list of supported TLS ciphers. Even the structure of the HTTP request itself, e.g. the order of the HTTP headers, can tell whether the request comes from a real web browser or a script.
> 
> Websites can check for these signals and block requests that don’t have the signature of a known web browser or show a CAPTCHA. You can bypass this protection using only plain HTTP requests because the protection does not collect any window attributes or evaluate any JavaScript code.
>
> **Bypassing HTTP request analysis**
> A straightforward way to circumvent the HTTP request analysis is to use a real web browser, such as headless Chrome, to emulate browser HTTP signatures. However, this can quickly become expensive since web browsers consume a lot of system resources and are generally slow.
>
> Thankfully, it is possible to emulate browsers’ HTTP request signatures even when using a low-level HTTP request library. This will make your scripted HTTP request look like a real web browser, yet it will be much faster and more efficient. Of course, this will only work in situations where the interesting page content is served directly in the first HTML response and not loaded later using AJAX.
>
> The Apify SDK provides a requestAsBrowser() function, which emulates the Firefox browser's HTTP headers. This makes it hard for the target site to tell the request isn’t coming from a full browser, unless it also uses browser fingerprinting.
>
> **User behavior analysis**
> Rather than analyzing and reacting to client requests in real time, websites can collect user behavior data over longer periods and then react to it only when sufficient information is available.
>
> Such data can contain the order in which you visit pages, how long you stay on each page, your mouse movements or even how fast you type in the form. If enough evidence indicates that the user’s behavior is not human, websites can block the client IP address or serve a CAPTCHA.

> **Browser fingerprinting**
> Websites can also use various techniques to test whether a client's web browser is used by a human user or a robot, and even identify repeated visits of the same web browser. This is known as browser fingerprinting and it can range from very primitive JavaScript challenges to state-of-the-art browser integrity tests and behavioral analyses.
>
> The tests look for things like information about your browser type and version, operating system, installed browser extensions, available fonts, timezone, among others. Combined, all this information forms a browser's “fingerprint”.
>
> While this information may seem quite generic, Panopticlick found that on average only 1 in 286,777 browsers will have the same fingerprint as you.

## Task 7

### Actors have a Restart on error option in their Settings. Would you use this for your regular actors? Why? When would you use it, and when not?

> There are many situations when this may cause a problem (especially when you are completely blocked by the site's defense so you may restart many-many times). But in some cases, when a small task needs to be done, it may really help.

### Migrations happen randomly, but by setting Restart on error and then throwing an error in the main process, you can force a similar situation. Observe what happens. What changes and what stays the same in a restarted actor run?

> This option isn't a good idea, when we develop or debug our actor. Because it possibly can have some errors or bugs, which will be reproduced if this option is on, and only we can fix these errors. It can be useful, if we have tested and bug-less actor and if this actor has some errors, which don't related to our code (like connection error etc.), "Restart on error" option will restart our actor, and these errors can be fixed by this restart. This option more suitable for production version of our actor.

### Why don't you usually need to add any special code to handle migrations in normal crawling/scraping? Is there a component that essentially solves this problem for you?

> Yes, special events are emitted (migration and persistState) and have been handled by the SDK itself.

### How can you intercept the migration event? How much time do you need after this takes place and before the actor migrates?

> On listening to the migration and persistState events and handling them. You have several seconds during which you can do some actions.

### When would you persist data to a default key-value store and when would you use a named key-value store?

> Default key-value store is good when we don't need to save our data to a long period, also default key-value store attached to a specific run of actor. We prefer to use named key-value store when we need to store data for a long period. Also, it doesn't attach to a specific run, and we can simple reach it. 
