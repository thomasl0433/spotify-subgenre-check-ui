/*
This component should be a documentation-esque static display to explain the website
*/

export default function HeaderInfo() {

    return (
        <div className="lg:m-10 sm:m-4 lg:w-1/3">
            <div className="bg-gray-200 rounded-xl p-6 mb-5 shadow-lg">
                <h3 className="font-bold text-gray-700 mb-2">🚨 Note:</h3>
                <p className="text-gray-500">While in development 🚧, you may need to be added to a list to be able to view your
                    data. Please reach out to Thomas to be added if you are experiencing errors
                </p>
            </div>
            <div className="bg-gray-200 rounded-xl p-6 shadow-lg">
                <h1 className="font-bold text-gray-700 mb-2">🧠 How it works:</h1>
                <p className="text-gray-500">This website visualizes the genre tags that are associated
                with each of your top artists on Spotify. They can be grouped by different periods of time,
                like the last month, three months, year, or all time.</p>
                <br></br>
                <p className="text-gray-500">It will display a packed bubble chart that shows off these genres,
                many of which you might not even know exist!</p>
                {/* <img src="../../public/demo.png" alt="demo of bubbles"></img> */}
            </div>
        </div>
    )
}