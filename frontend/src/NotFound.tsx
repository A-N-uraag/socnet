function NotFound() {
    return (
        <div className="d-flex justify-content-center align-items-center">
            <div className="d-flex flex-column">
                <h1 style={{textAlign:"center"}}>Uh-Oh!</h1>
                <h2 style={{textAlign:"center"}}>Page you are looking for is not built yet!</h2>
                <img src="https://media.giphy.com/media/3o7btLwXyvQZqQqQqU/giphy.gif" alt="404" />

            </div>
        </div>
    );
}

export default NotFound;