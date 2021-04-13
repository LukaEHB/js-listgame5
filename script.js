const ListCountGame = class{
    constructor(child, parent, total, footer, gameNumber){
      // option 1 (extra)
      this.addJQueryRefresh();
      this.$child = $(child);
      // console.log(this.$child.refresh());
      // console.log(this.$child.selector); // use this instead of this.child

      // option 2
      this.child = child;
      this.$parent = $(parent);
      this.$total = $(total);
      this.$footer = $(footer);
      this.$gameNumber = $(gameNumber);
      this.gameTotal = this.random(15,35);
      this.$gameNumber.text(this.gameTotal);
      this.initEvents();
      this.generateGame();
      this.calcTotal();

    }
    
    // option 1 (extra method)
    addJQueryRefresh(){
      $ = (function (originalJQuery) 
      {
          return (function () 
          {
              var newJQuery = originalJQuery.apply(this, arguments);
              newJQuery.selector = arguments.length > 0 ? arguments[0] : null;
              return newJQuery;
          });
      })($);
      
      $.fn = $.prototype = jQuery.fn;
      
      $.fn.refresh = function () 
      {
          if (this.selector != null && (typeof this.selector === 'string' || this.selector instanceof String))
          {
              var elems = $(this.selector);
              this.splice(0, this.length);
              this.push.apply(this, elems);
              console.log(this, elems);
          }
          return this;
      };
    }
  
    initEvents(){
      this.$parent.on('click',this.child,(e)=>{
        this.appendItem(e);
        this.calcTotal();
      });
    }
  
    appendItem(e){
      const $clickedItem = $(e.currentTarget);
      const $clickedParent = $clickedItem.parent();
      const clickedLeftList = $clickedParent.is(this.$parent.first());
      
      // append item to the other list
      if (clickedLeftList) {
        this.$parent.last().append($clickedItem);
      } else {
        this.$parent.first().append($clickedItem);
      }
      
    }
  
    calcTotal(){
      this.$parent.each((index, parent)=>{
        const $children = $(parent).find(this.child);
        let total = 0;
        // sum of list items
        $children.text((index, text)=>{
          if (isNaN(parseInt(text))) return;
          total += parseInt(text);
        });

        $(parent).next().find(this.$total).text(total);
      })
      this.checkWon();
    }

    generateGame(){
      let leftSequence = this.randomSequence();
      let rightSequence = this.randomSequence();
      const gameSequence = leftSequence.concat(rightSequence);
      this.shuffleArray(gameSequence);
      leftSequence = gameSequence.slice(0,gameSequence.length/2);
      rightSequence = gameSequence.slice(gameSequence.length/2,gameSequence.length);
      console.log(leftSequence, rightSequence);
      this.appendNumbers(leftSequence,this.$parent.first());
      this.appendNumbers(rightSequence,this.$parent.last());
      this.calcTotal();
    }

    appendNumbers(sequence,$parent){
      console.log(sequence);
      sequence.forEach(number => {
        $(`<li></li>`).text(number).appendTo($parent)
      });
    }

    shuffleArray(array) {
      for (let i = array.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [array[i], array[j]] = [array[j], array[i]];
      }
    }

    randomSequence(){
        const stepAmount = this.random(3,4); //4
        let prevAmount = 0;
        let sequence = [];
        for (let stepsLeft = stepAmount-1; stepsLeft >0; stepsLeft--) {
            const maxNumber = this.gameTotal-prevAmount-stepsLeft;
            const randomNumber = this.random(1,maxNumber);
            prevAmount += randomNumber;
            sequence.push(randomNumber);
        }
        const restValue = this.gameTotal - prevAmount;
        sequence.push(restValue);
        return sequence;
    }


    random(min, max){
      return  Math.floor(Math.random()*(max+1-min))+min;
    }

    checkWon(){
      const leftSideIsCorrect = (parseInt(this.$total.first().text()) == this.gameTotal);
      const rightSideIsCorrect = (parseInt(this.$total.last().text()) == this.gameTotal);
      console.log(leftSideIsCorrect,rightSideIsCorrect);
      if (leftSideIsCorrect && rightSideIsCorrect) {
        this.$footer.addClass("locked");
        this.$parent.off('click');
      }
    }

  }
  
  new ListCountGame('li','.js-list', ".js-total", ".js-footer", ".js-gameNumber");

// Simplified version of 5 steps:
/* #1  Recources? start?   ####
   - startcijfer = getal tussen 15-30
   - 6-8 random getallen 
*/
/* #2 Objectives? during?  ####
  - move items  between lists
  - recalculate total 
  - find the correct sequence
*/
/* #3 Obstacles? constant? ####
  - given total number (20)
  - randomized sequence
*/
/* #4    Interaction?      ####
  - click list item
*/
/* #5        Goal?         ####
   - 2 kollomen met eenzelfde totaal
   - het totaal wordt gevormd met random getllane
*/


/*------------------------
  |--- Game-generator ---|
  ------------------------
*/
// StartNumber: 20
// [17,1,1,1]

//##step1## (10)
// 20-0-3    = 17-1 ==> 10
//##step2## (5) 
// 20-10-2 = 8-1  ==> 5
//##step3## (3)
// 20-15-1 = 4-1  ==> 3
//##step4## (1)
// 20-(10+5+3) = 2

// =============> sum() = 20


// 2x lijsten  [17,1,1,1] =20 & [5,5,4,4,2]= 20

// [17,1,4,4,2] & [1,1,5,5]