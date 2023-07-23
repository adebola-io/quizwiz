# Frontend

Random notes regarding the project front-end. 

## On Animations

1. On the landing page, the question marks in the background should scroll in parallax. 
2. Each View transition should have a fade-in and a slight scroll in from the top.
3. The notification toast should have a soft bounce effect.
4. The Quiz modal should have a fade-in, expand and soft recoil effect when it loads. 
5. The loader should change color as it spins. 
6. Buttons should shrink and lose their box shadow on hover. 
7. The counter for stars earned should go red for a moment when it drops. It should get lighter green when it increases. 
8. On hover, the border of each option should be highlighted with a distinct color. The option back wireframe should collapse into it.  
9. The edge circles on the question intro should spin slowly. 

## On File Structure

1. All associated background images for special quizzes should be stored in the `/public/images/backgrounds` folder. 
2. All associated category icons should be stored in the `/public/images/icons` folder.
3. All generic UI components (Button, Timer, Toast, etc) should be stored in `src/components/ui` and exported from `/src/components/ui/index.js`.
4. All other components should be stored in `/src/components/fragments/${view}` and exported from `/src/components/fragments/{view}/index.js` where `view` is the name of the page where the component is used. 

## On App Functionality

1. Losing 3 questions in a row removes 1 star in normal quizzes and 2 stars in Rapid fire quizzes. 
2. Each question in a normal quiz has a duration:
	- 15 seconds in level 0 and 1, 
	- 10 seconds in level 2 and 3, and 
	- 8 seconds in level 4.
3. Getting 10 questions correct in a row during Rapid Fire should increase the timer by 15 seconds.
