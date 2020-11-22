# Software Studio 2018 Spring Assignment 01 Web Canvas

## Web Canvas
<img src="example01.gif" width="700px" height="500px"></img>

## Todo
1. **Fork the repo ,remove fork relationship and change project visibility to public.**
2. Create your own web page with HTML5 canvas element where we can draw somethings.
3. Beautify appearance (CSS).
4. Design user interaction widgets and control tools for custom setting or editing (JavaScript).
5. **Commit to "your" project repository and deploy to Gitlab page.**
6. **Describing the functions of your canvas in REABME.md**

## Scoring (Check detailed requirments via iLMS)

| **Item**                                         | **Score** |
| :----------------------------------------------: | :-------: |
| Basic components                                 | 60%       |
| Advance tools                                    | 35%       |
| Appearance (subjective)                          | 5%        |
| Other useful widgets (**describe on README.md**) | 1~10%     |

## Reminder
* Do not make any change to our root project repository.
* Deploy your web page to Gitlab page, and ensure it works correctly.
    * **Your main page should be named as ```index.html```**
    * **URL should be : https://[studentID].gitlab.io/AS_01_WebCanvas**
* You should also upload all source code to iLMS.
    * .html or .htm, .css, .js, etc.
    * source files
* **Deadline: 2018/04/05 23:59 (commit time)**
    * Delay will get 0 point (no reason)
    * Copy will get 0 point
    * "屍體" and 404 is not allowed

---

## Put your report below here

### Brush
1. Use "getElementById" and "addEventListener" to listen for click event.
2. When the brush is clicked, "var isPen" equals true.
3. Add a "mousedown" event begin to draw.
4. Use "mousemove" event while drawing.
5. When "mouseup", finish drawing.
6. Select the brush color by the color panel.
7. Select the size by size bar.

### Eraser
1. Basically the same as Brush.
2. Set the color white.

### Text
1. Use a down-scroll selection menu to choose font size.
2. Can also use color panel to choose font color.
3. Click on the text icon, and click on a spot on the canvas, then you can type some words.
4. I use some variables to record the current letter.

### Cursor
1. When you click on the brush icon, the cursor is a brush.
2. When you click on the eraser icon, the cursor is an eraser.
3. When you click on the text icon the cursor is "I"(something like this).

### Refresh button
1. Clear the canvas by "clearRect()".

### Brush shapes
1. Draw different brush shapes by clicking on different icon.
2. Every shape has two mode, stroke one and filled one.
3. You can change the stroke size by changing the size bar.
4. You can change the color by changing the color panel.

### Undo/Redo
1. Use cStep to record which step we are currently in.
2. We record everystep by using cPush() in mouseup and keyup events.
3. When undo icon is clicked, the current canvas will be cleared and replaced by the recorded canvas in former step.
4. Use the same method for redo.

### Image tool
1. Click the upload icon and you can upload an image from local to the canvas.

### Download
1. Click the download icon and you can save the current image.






