export default function Header() {
    return (
            <header className="header">
                <div className="main-menu">
                    <h1>
                        <a href="/">
                            <p><span>Eco</span>Drive</p>
                        </a>
                    </h1>
                    <div className="nav">
                        <a href="/trip/searchTrip"> Trouver un trajet</a>
                        <a href="/trip/new"> Publier un trajet</a>
                    </div>
                </div>
            </header>
    )
}