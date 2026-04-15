export default function LoginPage() {
  return (
    <>
      <div>
        <main className="flex-1 h-full bg-[#BEBABA] flex items-center justify-center p-8 overflow-hidden">
          <div>
            <h1 className="text-4xl font-bold mb-6">Login</h1>

            <form
              action=""
              className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
            >
              <div className="mb-4">
                <label
                  htmlFor="email"
                  className="block text-gray-700 font-bold mb-2"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="password"
                  className="block text-gray-700 font-bold mb-2"
                >
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>
              <div className="flex items-center justify-between">
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  Log In
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </>
  );
}
