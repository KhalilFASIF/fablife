## Installation

```bash
# database
$ https://www.postgresql.org/download/

# clone
$ git clone https://github.com/KhalilFASIF/fablife.git

# app
$ npm install
```

## Running the app

```bash
# run
$ npm run start
```

## Endpoints

# Ingredient

```bash
# ingredient
$ GET localhost:3000/ingredients
$ GET localhost:3000/ingredients/{id}
$ POST localhost:3000/ingredients
$ PUT localhost:3000/ingredients
$ DELETE localhost:3000/ingredients/{id}
```

id: number
body: {
  id: number,
  name: string,
  aisle: string
}

# Recipe

```bash
# ingredient
$ GET localhost:3000/recipes
$ GET localhost:3000/recipes/{id}
$ POST localhost:3000/recipes
$ PUT localhost:3000/recipes
$ DELETE localhost:3000/recipes/{id}
```

id: number
body: {
  id: number,
  name: string,
  type: 'breakfast' | 'launch', 'dinner',
  ingredients: {
    id: number,
    quantity: number
  }[]
}
