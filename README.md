# CS3219 Assignment E - Redis

I first fetched 5000 photos from http://jsonplaceholder.typicode.com/photos and stored them locally using Mongoose. When fetching the photos, I used Redis to cache 5000 photos and retrieve them from the cache.

---

#### Response time before caching
![image](https://user-images.githubusercontent.com/39623254/191664647-d6234da9-1bc9-4683-9f28-1c59b5adf644.png)

#### Response time after caching
![image](https://user-images.githubusercontent.com/39623254/191664668-a0747b43-e0d8-4382-8913-33350b25cf5d.png)
