let currentCateg = "top";

function renderHTML(newsList) {
    console.log(newsList)
    const storiesContainer = document.getElementById('topStoriesContainer');
    
    Array.from(storiesContainer.children).forEach(e => e.remove());
    
    newsList.forEach(news => {
        storiesContainer.insertAdjacentHTML("beforeend",
            (
                `<a class="news-item" href="${news.url}" target="blank" data-title="${news.title.toLocaleLowerCase()}">` +
                    `<h3 class="news-title">${news.title}</h3>` +
                    `<p class="news-byline">${news.by}</p>` +
                    `<p class="news-time">${news.time}</p>` +
                    `<p class="news-score"><i class="fa fa-thumbs-up"></i>${news.score}</p>` +
                `</a>`
            )
        )
    });
}

function dayName(dayInt)
{
    switch(dayInt)
    {
        case 1: return "Tuesday";
        case 2: return "Wednesday";
        case 3: return "Thursday";
        case 4: return "Friday";
        case 5: return "Saturday";
        case 6: return "Sunday";
        case 0: return "Monday";
        default: return "Noday";
    }
}

async function retrieveItem(id){
    const resp = await fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`);
    const res = await resp.json();

    if(res == null) return null;
    
    let { by, score, time, title, url } = res;
    let now = new Date(time * 1000);
    
    let Hours = now.getHours();
    let AMPM = Hours >= 12 ? "PM" : "AM";
    Hours = Hours > 12 ? Hours - 12 : Hours;
    Hours = Hours == 0 ? 12 : Hours;
    let Minutes = now.getMinutes();
    time = `${(Hours < 10 ? "0" : "") + Hours}:${(Minutes < 10 ? "0" : "") + Minutes}${AMPM} ${dayName(now.getDay())}, ${now.getDate()}-${now.getMonth()}-${now.getFullYear()}`;
    return { by, score, time, title, url };
}

async function fetchStories()
{
    console.log("Called");

    const resp = await fetch(`https://hacker-news.firebaseio.com/v0/${currentCateg}stories.json`);
    const ids = await resp.json();
    
    let items = ids.slice(0, 20).map(async e => await retrieveItem(e)).filter(e => e != null).slice(0, 21);
    Promise.all(items).then(items => renderHTML(items));
}

function caller(categ)
{
    console.log("but this was called: " + categ);

    return function(e){
        if(e)
        {
            e.preventDefault();
            e.stopPropagation();
        }

        document.querySelectorAll(".menuLink").forEach(e => e.classList.remove("selected"));
        document.querySelector(`.menuLink.${categ}`).classList.add("selected");
        currentCateg = categ;
        console.log("but this was also called");
        fetchStories();
    }
}

function onSearch()
{
    var query = document.querySelector("#searchBar").value;

    document.querySelectorAll(".news-item").forEach(e => {
        let title = e.getAttribute("data-title");
        let regMatch = new RegExp("(.)*" + query.toLocaleLowerCase() + "(.)*", "gi");
        if(title.search(regMatch))
        e.style.display = "none";
        else
        e.style.display = "block";
    });
}

document.querySelector("#searchBar").addEventListener("keyup", () => onSearch());
caller('top')();

/*
** by, score, time, title, type, url
*/