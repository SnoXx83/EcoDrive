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
                        <a href="/"> Trouver un trajet</a>
                        <a href="/"> Publier un trajet</a>
                    </div>
                </div>
            </header>
    )
}