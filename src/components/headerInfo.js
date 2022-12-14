/*
This component should be a documentation-esque static display to explain the website
*/

export default function HeaderInfo() {

    return (
        <div className="bg-gray-200 rounded-xl p-8 m-10 w-1/2">
            <h3 className="font-bold text-gray-700 mb-2">🚨 Note:</h3>
            <p className="text-gray-500">While in development 🚧, you may need to be added to a list to be able to view your
                data. Please reach out to Thomas to be added if you are experiencing errors
            </p>
        </div>
    )
}