from django.http import HttpResponse

def home(request):
    html_content = """
    <html>
        <head>
            <title>Notion Rides API</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    background-color: #f5f5f5;
                    text-align: center;
                    padding: 50px;
                }
                h1 {
                    color: #333;
                }
                a {
                    display: inline-block;
                    margin-top: 20px;
                    padding: 10px 20px;
                    background-color: #4CAF50;
                    color: white;
                    text-decoration: none;
                    border-radius: 5px;
                    transition: background-color 0.3s ease;
                }
                a:hover {
                    background-color: #45a049;
                }
            </style>
        </head>
        <body>
            <h1>Welcome to Notion Rides API</h1>
            <p>Nothing to look at here 😎</p>
            <a href="/api/docs"  target="_blank">Go to API Documentation
        </body>
    </html>
    """
    return HttpResponse(html_content)
