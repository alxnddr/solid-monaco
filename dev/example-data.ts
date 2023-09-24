export const exampleData = [
  {
    language: 'javascript',
    content: `async function fetchData(url) {
    try {
        let response = await fetch(url);
        let data = await response.json();
        console.log(data);
        return data;
    } catch (error) {
        console.error("An error occurred:", error);
        throw error;
    }
}

fetchData('https://api.example.com/data')
    .then(data => {
        console.log("Data fetched successfully:", data);
    })
    .catch(error => {
        console.error("Failed to fetch data:", error);
    });`,
  },
  {
    language: 'html',
    content: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sample Page</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <header>
        <h1>Welcome to My Website</h1>
    </header>
    <nav>
        <ul>
            <li><a href="#">Home</a></li>
            <li><a href="#">About</a></li>
            <li><a href="#">Contact</a></li>
        </ul>
    </nav>
    <main>
        <section>
            <h2>About Us</h2>
            <p>This is a sample paragraph describing the company or website. It provides users with an overview of what to expect.</p>
        </section>
    </main>
    <footer>
        <p>&copy; 2023 MyWebsite. All rights reserved.</p>
    </footer>
    <script src="script.js"></script>
</body>
</html>
    `,
  },
  {
    language: 'css',
    content: `body, h1, h2, p {
    margin: 0;
    padding: 0;
    font-family: Arial, sans-serif;
}

header {
    background-color: #4CAF50;
    color: white;
    text-align: center;
    padding: 1em 0;
}

nav ul {
    list-style-type: none;
    padding: 0;
    background-color: #333;
    overflow: hidden;
}

nav ul li {
    float: left;
}

nav ul li a {
    display: block;
    color: white;
    text-align: center;
    padding: 14px 16px;
    text-decoration: none;
}

nav ul li a:hover {
    background-color: #111;
}

main {
    padding: 20px;
}

section {
    margin-bottom: 20px;
}

footer {
    background-color: #333;
    color: white;
    text-align: center;
    padding: 10px 0;
    position: absolute;
    bottom: 0;
    width: 100%;
}`,
  },
] as const
