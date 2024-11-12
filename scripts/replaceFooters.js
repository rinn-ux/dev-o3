import * as fs from 'fs'

const HEADER = `<!-- BEGIN footer -->
            <div id="footer" role="contentinfo" class="region">
                <h3 class="landmark heading">Footer</h3>
                <ul class="navigation actions" role="navigation">
                    <li class="module group">
                        <h4 class="heading">Customize</h4>
                        <ul class="menu">
                            <li><a href="">Default</a></li>
                            <li><a href="">Happy 17th!</a></li>
                            <li><a href="">Low Vision Default</a></li>
                            <li><a href="">Reversi</a></li>
                            <li><a href="">Snow Blue</a></li>
                        </ul>
                    </li>
                    <li class="module group">
                        <h4 class="heading">About the Archive</h4>
                        <ul class="menu">
                            <li><a href="">Site Map</a></li>
                            <li><a href="">Diversity Statement</a></li>
                            <li><a href="">Terms of Service</a></li>
                            <li><a href="">DMCA Policy</a></li>
                        </ul>
                    </li>
                    <li class="module group">
                        <h4 class="heading">Contact Us</h4>
                        <ul class="menu">
                            <li>
                                <a href="">Policy Questions &amp; Abuse Reports</a>
                            </li>
                            <li><a href="">Technical Support &amp; Feedback</a></li>
                        </ul>
                    </li>
                    <li class="module group">
                        <h4 class="heading">Development</h4>
                        <ul class="menu">
                            <li>
                                <a href="">otwarchive v0.9.380.3</a>
                            </li>
                            <li><a href="">Known Issues</a></li>
                            <li>
                                <a href="">GPL-2.0-or-later</a>
                                by the
                                <a href="">OTW</a>
                            </li>
                        </ul>
                    </li>
                </ul>
            </div>
            <!-- END footer -->`

let files = fs
    .readdirSync('src', { recursive: true })
    .filter((p) => p.endsWith('.html'))

files.forEach((file) => {
    let data = fs.readFileSync('src/' + file, {
        encoding: 'utf8',
        flag: 'r',
    })

    data =
        data.split('<!-- BEGIN footer -->')[0] +
        HEADER +
        data.split('<!-- END footer -->')[1]

    fs.writeFileSync('src/' + file, data, {
        encoding: 'utf8',
        flag: 'w',
    })
})
