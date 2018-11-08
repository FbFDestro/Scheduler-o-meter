function setup() {
    createCanvas(800, 600);

    noStroke();

    background(220);

    rotate(-PI / 2);
    stroke(0);
    textSize(18);
    text("SJF", -82, 40);
    text("SRTF", -242, 40);
    noStroke();

    rotate(PI / 2);
    rect(50, 40, 700, 55);
    rect(50, 190, 700, 55);

    textSize(12);
    text("tempo", 50, 18);
    stroke(0);
    line(50, 20, 750, 20);
    fill(0);
    triangle(740, 15, 740, 25, 750, 20);

    noStroke();
    text("tempo", 50, 168);
    stroke(0);
    line(50, 170, 750, 170);
    fill(0);
    triangle(740, 165, 740, 175, 750, 170);


}

function draw() {

    noStroke();
    fill(200);
    rect(50, 40, 20, 55);

  }