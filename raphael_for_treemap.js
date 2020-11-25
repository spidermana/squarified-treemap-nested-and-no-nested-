/*
 * Treemap Squared 0.5 - Treemap Charting library 
 *
 * https://github.com/imranghory/treemap-squared/
 *
 * Copyright (c) 2012 Imran Ghory (imranghory@gmail.com)
 * Licensed under the MIT (http://www.opensource.org/licenses/mit-license.php) license.
 */

 /* Hints for JSHint */ 
 /*global Raphael, Treemap */ 

        // some utility functions 
        function isArray(arr) {
            return arr && arr.constructor === Array; 
        }

        function isFunction(func) {
            return func && func.constructor === Function; 
        }

        // mergeProperies - given two sets of associative arrays merge the,
        //                  for clashes copy the new value over the original one
        //第一个是默认参数，第二个是用户指定参数。
        //如果是用户指定的style新增的属性，则加入。否则以默认值优先。
        function mergeProperties(originalproperties, newproperties) {
            var property;
            for (property in newproperties) {
                if (newproperties.hasOwnProperty(property)) {
                    originalproperties[property] = newproperties[property];
                }
            }
         return originalproperties;
        }

        // drawTreemap - recursively iterate through the nested array of boxes
        //               and call the styles['draw'] method on them
        function drawTreemap(paper, boxes, labels, styles, index) {
            var i,j;
            var newindex; // the index to the next box to draw
            var label; // label of current box
           
            //这里的逻辑有一些问题。不能只简单判断第一个box的情况！！！

            if(isArray(boxes[0][0])) {  //如果是nested，嵌套treemap
                for(i=0; i<boxes.length; i++) { //
                    newindex = index.slice();
                    newindex.push(i);
                    drawTreemap(paper, boxes[i],labels, styles, newindex);
                }
            } else {
                for(i=0; i<boxes.length; i++) {
                    newindex = index.slice();
                    newindex.push(i);
                    console.log("newindex",newindex);
                    
                    // figure out the matching label using the index 
                    label = labels;
                    for(j=0; j<newindex.length; j++){
                        label = label[newindex[j]];
                    }
                    
                    // draw box & label
                    console.log(boxes[i],label,newindex);
                    //debugger;
                    
                    styles.draw(boxes[i], label, newindex); //实际是boxDrawer函数。
                    //debugger;
                    
                }
            }
        }

        //style参数标识了用户指定的属性字典。可以加入到默认属性中
        function draw(element, width, height, data, labels, styles) {
            var paper, background, nodes, labelFormatter, boxDrawer;
            styles = (typeof styles === "undefined") ? [] : styles;      //如果没有选择特定的sytle就默认。styles这里是全局变量。

            /* create some default style functions */

            // This label formatter calculates a font-size based upon 
            // average label length and the size of the box the label is 
            // going into. The maximum font size is set to 20px.  
            //返回一个font属性的字典。
            labelFormatter = function () {      //计算每个方块中的字体大小应该为多少【和box的size对应】，设置上线大小为20px              
                var averagelabelsize = totalLabelLength(labels) / countLabels(labels);  //计算每个元素的平均长度

                // total length of labels (i.e [["Italy"],["Spain", "Greece"]] -> 16)
                function totalLabelLength(arr) {    //该函数用于计算labels中每个元素加起来的总长度。【子数组递归求其元素】
                    var i, total = 0;
                    if(isArray(arr[0])) {
                        for(i=0; i<arr.length; i++) {
                            total += totalLabelLength(arr[i]);
                        }
                    } else {
                        for (i = 0; i<arr.length; i++){     //数组长度
                           total += arr[i].length;  //数组中元素的长度
                        }
                    }
                    return total;   
                }

                // count of labels (i.e [["Italy"],["Spain", "Greece"]] -> 3)
                function countLabels(arr) { //计算一共有多少个元素。
                    var i, total = 0;
                    if(isArray(arr[0])) {
                        for(i=0; i<arr.length; i++) {
                            total += countLabels(arr[i]);
                        }
                    } else {
                        for (i = 0; i<arr.length; i++){ //数组中元素个数。直接total+=arr.length就好了
                           total += 1;  
                        }
                    }
                    return total;
                }

                function fontSize(width, height) {
                    // the font size should be proportional to the size of the box (and the value)
                    // otherwise you can end up creating a visual distortion where two boxes of identical
                    // size have different sized labels, and thus make it look as if the two boxes
                    // represent diffferent sizes
                    var area = width*height;    //fontSize的算法可以自定义。【正反比明确即可】
                    var arearoot = Math.pow(area, 0.5);
                    return Math.min( arearoot / (averagelabelsize), 20);  //arearoot可以表征这个label的box有多大。box越大应该Size越大，如果label长度越长，size就应该更新。
                }

                function style(coordinates, index) {
                    return { "fill" : "#FCFCFC", "font-size": fontSize(coordinates[2] - coordinates[0], coordinates[3] - coordinates[1] )};   
                }

                return style;
            }();    //调用labelFormatter，相当于在调用style->fontSize。

            // default style for boxes
            //返回box的style属性字典【stroke定义一条白线】
            var boxFormatter = function (coordinates, index) {
                var colors = ["hsb(0,1,0.4)", "hsb(0.2,1,0.4)", "hsb(0.4,1,0.4)", "hsb(0.6,1,0.4)", "hsb(0.8,1,0.4)"];  
                var color = (index.length === 1) ? colors[2] : colors[(index[0] + 2) % 5];        //颜色的选择可选。可修改  
                return  { "stroke": "FEFEFE", "fill" : color};  
            };


            // default box & label drawing routine - in most cases this default one in combination with changing the styles
            // will suffice. Only if you're doing something complex and want to rewrite how the treemap gets drawn
            // would you replace this. 

            boxDrawer = function () {   //画一个box和box中text。
                function drawbox(coordinates, label, newindex) {    //画一个长方形。
                    var x1=coordinates[0], y1=coordinates[1], x2=coordinates[2], y2=coordinates[3];
                    var box, text;
                    var boxattr, labelattr;
                    var rgbobj;

                    // draw box 
                    box = paper.rect(x1, y1, x2 - x1, y2 - y1); // 常规的长方形。【如果还有第五个参数则是rouned corner】
                    
                    boxattr = isFunction(styles.box) ? styles.box(coordinates, newindex) : styles.box;  //获取box的属性
                    boxattr = mergeProperties(boxFormatter(coordinates, newindex), boxattr);    //属性叠加。得到最后的box属性

                    // dirty hack to fix opacity support in non-webkit web browsers
                    if ("fill-opacity" in boxattr) {    //如果有fill-opacity属性，那么就更新box fill color
                        rgbobj = Raphael.getRGB(boxattr.fill);
                        if (!rgbobj.error) {
                            boxattr.fill = "rgba(" + rgbobj.r + "," + rgbobj.g + "," + rgbobj.b + "," + boxattr['fill-opacity'] + ")";
                        } 
                    }

                    box.attr(boxattr);  //给刚刚画的box，加入属性。渲染

                    // draw labels 
                    console.log(label);
                    text = paper.text((x1 + x2) / 2, (y1 + y2) / 2, label); //在画布上写上label

                    labelattr = isFunction(styles.label) ? styles.label(coordinates, newindex) : styles.label;
                    labelattr = mergeProperties(labelFormatter(coordinates, newindex), labelattr);  //用户指定的style融合默认的属性。

                    text.attr(labelattr);   //附加属性到text上。

                    // if the label fits better sideways then rotate it
                    if(text.getBBox().width > x2-x1 && text.getBBox().width <= y2-y1) { //根据box的情况，决定text要不要转置
                        text.rotate(-90); //尝试90度，旋转找到最合适的状态。
                    }
                    // TODO: add more sophisticated logic to shrink text if it overflows the box size   
                }
                return drawbox;
            }();
            //如果没有设置这些属性，那么style的这些项都为空。除了boxDrawer函数用于画一个box和text。
            styles.background = (typeof styles.background  === "undefined") ? {} : styles.background;
            styles.label = (typeof styles.label  === "undefined") ? {} : styles.label;
            styles.box = (typeof styles.box  === "undefined") ? {} : styles.box;
            styles.draw = (typeof styles.draw  === "undefined") ? boxDrawer : styles.draw;

            // create our canvas and style the background 
            paper = new Raphael(element, width, height);    //新建画布

            background = paper.rect(0, 0, width, height);   //基本的background【最外层的盒子】
            background.attr(styles.background);

            // generate our treemap from our data
            //nodes = Treemap.generate(data, width, height);  //根据数据，构造treemap
            var area = calcArea(data,width*height);
            nodes = nestedSquarifiedTreemap(area,0,0,width,height);
            // draw the generated treemap
            console.log("nodes",nodes,nodes.length);
            drawTreemap(paper, nodes, labels, styles, []);  //画出generate的treemap【data都化成了treemap的节点和布局。】
        }