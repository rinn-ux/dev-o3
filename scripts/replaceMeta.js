import * as fs from 'fs'

const META = ``

let files = fs
    .readdirSync('src', { recursive: true })
    .filter((p) => p.endsWith('.html'))

files.forEach((file) => {
    let data = fs.readFileSync('src/' + file, {
        encoding: 'utf8',
        flag: 'r',
    })

    data =
        data.split('<!-- BEGIN header -->')[0] +
        HEADER +
        data.split('<!-- END header -->')[1]

    fs.writeFileSync('src/' + file, data, {
        encoding: 'utf8',
        flag: 'w',
    })
})
