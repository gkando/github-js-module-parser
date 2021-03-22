# Github JS Module Dependency Parser

Github Dependency Parser is a node web service which outputs JavaScript file dependencies for a given repo.

Live Demo:

Live FE Demo:

Frontend repo:

## Installation

```bash
#install dependencies
yarn

#fire up the app on your local server
yarn server
```

## Endpoints

#### Service Routes

| Method | Endpoint            | Access Control | Description                                  |
| ------ | ------------------- | -------------- | -------------------------------------------- |
| GET    | `/`                 | all users      | Returns API status.                          |
| POST   | `/service/repo`     | all users      | Returns the contents of a github repository. |
| POST   | `/service/contents` | all users      | Returns the dependencies for a file.         |

**Data examples**

All fields must be sent in req.body.

`POST` `/service/repo`

```json
{
  "url": "https://github.com/foo/js-project/"
}
```

`POST` `/service/contents`

```json
{
  "url": "https://api.github.com/repos/foo/js-project/contents/src/index.js",
  "type": "file"
}
```

## Testing

```bash
yarn test
```

## License

[MIT](https://choosealicense.com/licenses/mit/)
