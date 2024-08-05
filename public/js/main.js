document.addEventListener('DOMContentLoaded', function () {
    function showMessage(message, isError = false) {
      const messageDiv = document.createElement('div');
      messageDiv.textContent = message;
      messageDiv.style.position = 'fixed';
      messageDiv.style.top = '20px';
      messageDiv.style.left = '50%';
      messageDiv.style.transform = 'translateX(-50%)';
      messageDiv.style.padding = '10px';
      messageDiv.style.borderRadius = '5px';
      messageDiv.style.color = 'white';
      messageDiv.style.backgroundColor = isError ? 'red' : 'green';
      document.body.appendChild(messageDiv);
      setTimeout(() => {
        messageDiv.remove();
      }, 3000);
    }
  
    // Handle Login
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
      loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const emailElement = document.getElementById('email');
        const passwordElement = document.getElementById('password');

        if (!emailElement || !passwordElement){
            console.error('email or password not found');
            showMessage('email or password not found', true);
            return;
        }

        const email = emailElement.value;
        const password = passwordElement.value;

        try {
          const response = await fetch('/users/login', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({email, password})
          });
  
          const data = await response.json();
          if (response.ok) {
            showMessage('Login successful');
            window.location.href = '/';
          } else {
            showMessage(data.error, true);
          }
        } catch (error) {
          console.error('Error:', error);
          showMessage('An error occurred', true);
        }
      });
    }
  
    // Handle Registration
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
      registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const emailElement = document.getElementById('email');
        const passwordElement = document.getElementById('password');

        if (!emailElement || !passwordElement){
            console.error('email or password not found');
            showMessage('email or password not found', true);
            return;
        }

        const email = emailElement.value;
        const password = passwordElement.value;
  
        try {
          const response = await fetch('/users/register', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({email, password})
          });
  
          const data = await response.json();
          if (response.ok) {
            showMessage('Registration successful');
            window.location.href = '/login.html';
          } else {
            showMessage(data.message, true);
          }
        } catch (error) {
          console.error('Error:', error);
          showMessage('An error occurred', true);
        }
      });
    }
  
    // Handle Recipe Search
    function search() {
        const searchInput = document.getElementById('search');
        if (searchInput) {
            const text = searchInput.value;
            if (text.length > 2) {
                fetchRecipes(text);
            }
        }
    }

    // Function to fetch recipes based on search text
    function fetchRecipes(text) {
        fetch(`/recipes/search?text=${text}`)
            .then(response => response.json())
            .then(recipes => {
                const recipesList = document.getElementById('recipes');
                recipesList.innerHTML = '';

                recipes.forEach(recipe => {
                    const recipeBox = createRecipeBox(recipe);
                    recipesList.appendChild(recipeBox);
                });
            })
            .catch(error => console.error('Error fetching recipes:', error));
    }

    // Handle Recipe Search on keyup event
    const searchInput = document.getElementById('search');
    if (searchInput) {
        searchInput.addEventListener('keyup', () => search());
    }

    // Expose the search function to the global scope
    window.search = search;

    // Handle Adding Recipes
    const addRecipeForm = document.getElementById('addRecipeForm');
    if (addRecipeForm) {
      addRecipeForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const title = document.getElementById('title').value;
        const ingredients = document.getElementById('ingredients').value;
        const steps = document.getElementById('steps').value;
  
        try {
          const response = await fetch('/recipes/add', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({title, ingredients, steps})
          });
  
          const data = await response.json();
          if (response.ok) {
            showMessage('Recipe added successfully');
            window.location.href = '/';
          } else {
            showMessage(data.message, true);
          }
        } catch (error) {
          console.error('Error:', error);
          showMessage('An error occurred', true);
        }
      });
    }
  
    // Handle Fetching Recipes for Home Page
    async function fetchRecipes(ownRecipe = false) {
      try {
        const response = await fetch(ownRecipe ? '/users/my-recipes' : '/recipes');
        const recipes = await response.json();
        const recipesList = document.getElementById('recipes');
        recipesList.innerHTML = '';
  
        recipes.forEach(recipe => {
          const recipeBox = createRecipeBox(recipe, ownRecipe);
          recipesList.appendChild(recipeBox);
        });
      } catch (error) {
        console.error('Error fetching recipes:', error);
      }
    }
  
    // Create a recipe box
    function createRecipeBox(recipe, ownRecipe = false) {
      const recipeBox = document.createElement('div');
      recipeBox.className = 'recipe-box';
  
      const title = document.createElement('h3');
      title.textContent = recipe.title;
      recipeBox.appendChild(title);
  
      const ingredients = document.createElement('h4');
      ingredients.textContent = `Ingredients:`;
      recipeBox.appendChild(ingredients);

      const ingredientsList = document.createElement('p');
      ingredientsList.textContent = `${recipe.ingredients}`; 
      recipeBox.appendChild(ingredientsList);
  
      const steps = document.createElement('h4');
      steps.textContent = `Steps:`;
      recipeBox.appendChild(steps);

      const stepsList = document.createElement('p');
      stepsList.textContent = `${recipe.steps}`;
      recipeBox.appendChild(stepsList);

      if (ownRecipe) {
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.onclick = () => deleteRecipe(recipe.id, recipeBox);
        recipeBox.appendChild(deleteButton);
      }
      
      return recipeBox;
    }
  
    // Call fetchRecipes if on the home page
    if (document.getElementById('recipes')) {
      fetchRecipes();
    }

    // handle deleteRecipe
    async function deleteRecipe(recipeId, recipeBox) {
      try {
        const response = await fetch(`/recipes/${recipeId}`, {
        method: 'DELETE'
        });

        if (response.ok) {
          showMessage('Recipe deleted');
          recipeBox.remove();
        } else {
          showMessage('Could not delete recipe', true);
        }

      } catch (error) {
        console.error('Error deleting recipe', error);
        showMessage('Error occurred', true);
      }
    }

    // handle profile menu
    const signOutButton = document.getElementById('signOut');
    const viewMyRecipesButton = document.getElementById('viewMyRecipes');
    const userEmailElement = document.getElementById('userEmail');

    if (viewMyRecipesButton) {
      viewMyRecipesButton.addEventListener('click', () => fetchRecipes(true));
    }
    
    async function fetchUserInfo() {
        try {
            const response = await fetch('/users/me');
            const data = await response.json();
            if (response.ok && data.email) {
                userEmailElement.textContent = `Hi, ${data.email}`;
                userEmailElement.style.display = 'block';
            } else {
                userEmailElement.style.display = 'none';
            }
        } catch (error) {
            console.error('Error fetching user info:', error);
            userEmailElement.style.display = 'none';
        }
    }

    if (signOutButton) {
        signOutButton.addEventListener('click', async () => {
            try {
                const response = await fetch('/users/logout', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                if (response.ok) {
                    showMessage('Signed out successfully');
                    userEmailElement.style.display = 'none';
                    window.location.href = '/';
                } else {
                    let data;
                    try {
                        data = await response.json();
                        showMessage(data.message || 'an error occurred')
                    } catch (err) {
                        console.error('Expected JSON response but got:', err);
                        showMessage('An error occurred during sign out', true);
                        return;
                    }
                    showMessage(data.message || 'An error occurred', true);
                }
            } catch (error) {
                console.error('Error:', error);
                showMessage('An error occurred', true);
            }
        });
    }
    fetchUserInfo();
});  