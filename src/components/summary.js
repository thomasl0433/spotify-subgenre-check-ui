/*
This component should provide a text summary of the packed bubble chart
*/

export default function Summary(props) {
    const makeid = (length) => {
        var result           = '';
        var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for ( var i = 0; i < length; i++ ) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }

    const listItems = props.sortedGenres.map((item, idx) => {
        const arg = item[0].replaceAll(' ', '').replaceAll(/\W/g, '')
        const id = makeid(10);
        const url = `https://everynoise.com/engenremap-${arg}.html`
        let fontSize = ""

        if (idx <= 5) {
            fontSize = "text-3xl"
        } else if (idx <= 15) {
            fontSize = "text-2xl"
        } else if (idx <= 25) {
            fontSize = "text-xl"
        } else if (idx <= 35) {
            fontSize = "text-lg"
        }

        const styleString = `text-gray-500 underline ${fontSize}`

        return <li key={id} className={styleString}><a href={url} target="_blank" rel="noreferrer">{item[0]}</a></li>
    })

    return (
        <div className="text-center bg-green-100 rounded-xl p-6 mb-5 shadow-lg">
            <h1 className="text-gray-700 text-2xl font-bold">📈 Summary</h1>
            <p className="text-gray-500 mb-2">Click to explore each of your top genres</p>
            <ol>{listItems}</ol>
        </div>
    )
}