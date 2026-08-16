import lazySizes from 'lazysizes';

export function newsApiCall() {

	// DOM Elements
	const section = document.getElementById('newsSection');
	const tabsList = document.querySelectorAll('.tabs');

	// convert nodeList into array
	const tabsArr = [...tabsList];

	// Headline Feed API Data
	// https://headlinefeed.dev/documentation
	const bearerToken = 'hlf_52ed296a508d412aa74a5fc0c0a3e8f5';
	const baseURL = 'https://api.headlinefeed.dev';
	const sourcesURL = 'https://api.headlinefeed.dev/api/sources';


	// News API Data
	const apiKey = '22e8781300b74ae1b67d95e8d027d555';
	const guardUrl = 'https://newsapi.org/v2/top-headlines?sources=the-guardian-uk&apiKey=' + apiKey;
	const bbcNewsUrl = 'https://newsapi.org/v2/top-headlines?sources=bbc-news&apiKey=' + apiKey;
	const reutersUrl = 'https://newsapi.org/v2/top-headlines?sources=reuters&apiKey=' + apiKey;
	const natGeoUrl = 'https://newsapi.org/v2/top-headlines?sources=national-geographic&apiKey=' + apiKey;
	const newsUrls = [guardUrl, bbcNewsUrl, reutersUrl, natGeoUrl];

	// Request News Function
	async function getNews(url) {
		var response = await fetch(url);
		if (response.ok) {
			const jsonResponse = await response.json();
			//console.log(jsonResponse);

			// saving the first 10 articles from every object
			const articlesArray = jsonResponse.articles.slice(0, 10);
			//console.log(articlesArray);
			return articlesArray;
		}
	}

	// Render News Function
	function renderNews(articles) {
		articles.map((article, index) => {

			const formatDate = dateUtcInput => {
				const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
				const weekdays = ['Sunday', 'Monday', 'Tuesady', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
				const utcDate = new Date(dateUtcInput);
				const weekday = utcDate.getDay();
				const day = utcDate.getDate();
				const month = utcDate.getMonth();
				const year = utcDate.getFullYear();
				const dateStr = weekdays[weekday] + ', ' + day + ' ' + months[month] + ' ' + year;
				const publishedDate = (dateUtcInput != null) ? ('<small class="article-date">' + dateStr + '</small>') : ' ';
				return publishedDate;
			}

			const author = (article.author != null) ? `<small class="article-author">By ${article.author}</small>` : ' ';
			const description = (article.description != null) ? `<p>${article.description}</p>` : ' ';
			const isNewsContentOdd = (index % 2 == 0) ? 'news-content--odd' : '';
			const isButtonOdd = (index % 2 == 0) ? 'btn--odd' : '';

			const newsContent =
				`<article class="article">
				<div class="news-content">
					<div class="title-container">
						<h2 class="title"><span class="quotes"></span>${article.title}</h2>
					</div>
					<div class="description">
						${author}
						${formatDate(article.publishedAt)}
						${description}
						<a href="${article.url}" target="_blank" class="btn  ${isButtonOdd}"><span class="btn-text">Read More</span></a>
					</div>
				</div>
				<div class="image-container">
					<img class="image lazyload" data-src="${article.urlToImage}" />
				</div>
			</article>`;

			section.innerHTML += newsContent;
		});

		return articles;
	}

	// display first tab content on window load
	window.onload = displayFirstTabContent();


	function displayNewsArticles(articlesArray) {
		renderNews(articlesArray);
	}


	function displayFirstTabContent() {
		// clean content
		section.innerHTML = ' ';
		getNews(newsUrls[0]).then(displayNewsArticles);

		function events() {
			tabsArr.forEach((tab, tabIndex) => {
				tab.className = "tabs";
			});

			this.className = "tabs is-active";
		}

		tabsArr.forEach(tab => {
			tab.addEventListener('click', events, false);
		});

	}


	// Display news content
	tabsArr.forEach((tab, tabIndex) => {
		tab.addEventListener("click", function (event) {
			newsUrls.forEach((news, newsIndex) => {
				if (newsIndex == tabIndex) {
					// clean content
					section.innerHTML = ' ';
					getNews(news).then(displayNewsArticles);
				}
			});

		}, false);
	});

}


