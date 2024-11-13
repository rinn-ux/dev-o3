import * as fs from 'fs'

const HEADER = `<!-- BEGIN header -->

            <header id="header" class="region">
                <h1 class="heading">
                    <a href="/"><span>Archive of Our Own</span><sup> beta</sup><img alt="Archive of Our Own" class="logo" src="/images/ao3_logos/logo_42.png" /></a>
                </h1>

                <nav id="greeting" aria-label="User">
                    <ul class="user navigation actions">
                        <li class="dropdown">
                            <a href="/users/User">Hi, User!</a>
                            <ul class="menu">
                                <li><a href="/users/User">My Dashboard</a></li>
                                <li>
                                    <a href="/users/User/subscriptions.html">My Subscriptions</a>
                                </li>
                                <li><a href="/users/User/works.html">My Works</a></li>
                                <li><a href="/users/User/bookmarks.html">My Bookmarks</a></li>
                                <li><a href="/users/User/readings.html">My History</a></li>
                                <li>
                                    <a href="/users/User/preferences.html">My Preferences</a>
                                </li>
                            </ul>
                        </li>
                        <li class="dropdown">
                            <a href="/works/new.html">Post</a>
                            <ul class="menu">
                                <li><a href="/works/new.html">New Work</a></li>
                                <li><a href="/works/newImport.html">Import Work</a></li>
                            </ul>
                        </li>
                        <li>
                            <a rel="nofollow" data-method="delete" href="/">Log Out</a>
                        </li>
                    </ul>

                    <p class="icon">
                        <a href="/users/User"><img alt="Nahida Art - Face Zoomed In" class="icon" src="https://s3.amazonaws.com/otw-ao3-icons/icons/1410309/standard.png?1731092967" /></a>
                    </p>
                </nav>

                <nav aria-label="Site">
                    <ul class="primary navigation actions">
                        <li class="dropdown">
                            <a href="/menu/fandoms.html">Fandoms</a>
                            <ul class="menu">
                                <li><a href="/media">All Fandoms</a></li>
                                <li id="medium_5">
                                    <a href="/media/random">Anime &amp; Manga</a>
                                </li>
                                <li id="medium_3">
                                    <a href="/media/random">Books &amp; Literature</a>
                                </li>
                                <li id="medium_4">
                                    <a href="/media/random">Cartoons &amp; Comics &amp; Graphic Novels</a>
                                </li>
                                <li id="medium_7">
                                    <a href="/media/random">Celebrities &amp; Real People</a>
                                </li>
                                <li id="medium_2">
                                    <a href="/media/random">Movies</a>
                                </li>
                                <li id="medium_6">
                                    <a href="/media/random">Music &amp; Bands</a>
                                </li>
                                <li id="medium_8">
                                    <a href="/media/random">Other Media</a>
                                </li>
                                <li id="medium_30198">
                                    <a href="/media/random">Theater</a>
                                </li>
                                <li id="medium_1">
                                    <a href="/media/random">TV Shows</a>
                                </li>
                                <li id="medium_476">
                                    <a href="/media/random">Video Games</a>
                                </li>
                                <li id="medium_9971">
                                    <a href="/media/random">Uncategorized Fandoms</a>
                                </li>
                            </ul>
                        </li>
                        <li class="dropdown">
                            <a href="/menu/browse.html">Browse</a>
                            <ul class="menu">
                                <li><a href="/works">Works</a></li>
                                <li><a href="/bookmarks">Bookmarks</a></li>
                                <li><a href="/tags">Tags</a></li>
                                <li><a href="/collections">Collections</a></li>
                            </ul>
                        </li>
                        <li class="dropdown">
                            <a href="/menu/search.html">Search</a>
                            <ul class="menu">
                                <li><a href="/works/search.html">Works</a></li>
                                <li><a href="/bookmarks/search.html">Bookmarks</a></li>
                                <li><a href="/tags/search.html">Tags</a></li>
                                <li><a href="/people/search.html">People</a></li>
                            </ul>
                        </li>
                        <li class="dropdown">
                            <a href="/menu/about.html">About</a>
                            <ul class="menu">
                                <li><a href="/about.html">About Us</a></li>
                                <li><a href="/admin_posts.html">News</a></li>
                                <li><a href="/faq.html">FAQ</a></li>
                                <li>
                                    <a href="/wrangling_guidelines.html">Wrangling Guidelines</a>
                                </li>
                                <li><a href="/donate.html">Donate or Volunteer</a></li>
                            </ul>
                        </li>
                        <li class="search">
                            <form class="search" id="search" role="search" aria-label="Work" action="/works/search" accept-charset="UTF-8" method="get">
                                <fieldset>
                                    <p>
                                        <label class="landmark" for="site_search">Work Search</label>
                                        <input class="text" id="site_search" aria-describedby="site_search_tooltip" type="text" name="work_search[query]" />
                                        <span class="tip" role="tooltip" id="site_search_tooltip">tip: lex m/m (mature OR explicit)</span>
                                        <span class="submit actions"><input type="submit" value="Search" class="button" /></span>
                                    </p>
                                </fieldset>
                            </form>
                        </li>
                    </ul>
                </nav>

                <div class="clear"></div>
            </header>

            <!-- END header -->`

let files = fs
    .readdirSync('src', { recursive: true })
    .filter((p) => p.endsWith('.html'))

files.forEach((file) => {
    let data = fs.readFileSync('src/' + file, {
        encoding: 'utf8',
        flag: 'r',
    })

    if (data.includes('<!-- BEGIN header -->')) {
        data =
            data.split('<!-- BEGIN header -->')[0] +
            HEADER +
            data.split('<!-- END header -->')[1]

        fs.writeFileSync('src/' + file, data, {
            encoding: 'utf8',
            flag: 'w',
        })
    }
})
