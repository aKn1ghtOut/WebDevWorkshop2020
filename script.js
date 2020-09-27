let category = "top";

function clicker(headingText) {
    document.querySelectorAll("aside > a").forEach(function(el)
    {
        el.classList.remove("selected");
    });

    document.querySelector(`aside > a.${headingText.toLowerCase()}`).classList.add("selected")

    let heading = document.querySelector('#newsList > h2');
    heading.innerText = headingText + " Stories";

    category = headingText.toLowerCase();
    fetcher();
}

async function fetcher()
{
    document.querySelector("#topStoriesContainer").innerHTML = "";

    const resp = await fetch(`https://hacker-news.firebaseio.com/v0/${category}stories.json`);
    const ids = await resp.json();
    //JSON = JavaScript Object Notation
    //const itemsArray = [];

    let items = ids.slice(0, 20);
    console.log(items);

    for(let i = 0 ; i < 20 ; i++)
    {
        const itemData = await fetch(`https://hacker-news.firebaseio.com/v0/item/${items[i]}.json`);
        const resp = await itemData.json();
        //itemsArray.push(resp);

        const inserter = 
        `<a class="news-item" href="${resp.url}" target="blank" data-title="${resp.title}">` +
            `<h3 class="news-title">${resp.title}</h3>` +
            `<p class="news-byline">${resp.by}</p>` +
            `<p class="news-time">${resp.time}</p>` +
            `<p class="news-score">` +
                `<i class="fa fa-thumbs-up"></i>${resp.score}` +
            `</p>` +
        `</a>`;

        console.log(inserter)

        document.querySelector("#topStoriesContainer").insertAdjacentHTML("beforeend", inserter);
    }
}

function main()
{
    console.log("Hey");
}

fetcher();
main();

function topClicked(){
    clicker("Top");
}

function bestClicked(){
    clicker("Best");
}

function newClicked(){
    clicker("New");
}


// useTimeout and useInterval
// blocking and non-blocking