var superagent = require('superagent');
var cheerio = require('cheerio');
var fs = require('fs');

var ans = [];
var solvednum =0;
var totalnum = 0;
var lockednum =0;
function makeMarkDownFile(){
    var str='';
    str += '# :pencil2: Leetcode Solutions with JavaScript  or C++';
    str +='\n';
    str += 'Update time: '+ new Date();
    str +='\n';
    str += 'I have solved **'+solvednum+'/'+totalnum +'**problems';
    str += 'and there are **'+lockednum+'**problems still locked';
    str +='\n';
    str += '| ID | Title | Source Code | Explaination | Difficulty | Tag |';
    str +='\n';
    str +='|:---:|:---:|:---:|:---:|:---:|:---:|';
    str +='\n';

    ans.sort(function(a,b){
        return a.problemId >b.problemId;
    });

    ans.forEach(function(item,index){
        var problemId = item.problemId;
        var title = item.title;
        var url = item.url;
        var language = item.language;
        var sourceCode = item.sourceCode;
        var explaination = item.explaination;
        var difficulty =item.difficulty;
        var tags = item.tags;    //新增标签
        var acceptance =item.acceptance;
        var isSolved = item.isSolved;
        var isLocked = item.isLocked;
        str +='| ' +problemId+ ' ';
        str +='| '+'['+title+']('+url+') ';
        if(isSolved){
            str += '| ' + '[' + language + '](' + sourceCode + ') ';
        }else if(isLocked){
             str += '| :blue_book: ';
        }else{
            str +='| ';
        }
        if(explaination){
            str +='| '+'[Explaination]('+explaination+') ';
        }else{
            str +='| ';
        }
        str +='| '+difficulty+' | ';
        str += '| '+acceptance+' |';
        str +='\n';
    })

    var makeFileSrc = '/Users/dongruining/leetcode-/README.md';
    fs.writeFile(makeFileSrc,str);
    console.log('success');
}

function dealWithFile(){
    var baseLocalUrl = '/Users/dongruining/leetcode-/answers';
    var githubUrl = '';
    for(var i=0;i<ans.length;i++){
        (function(i){
            var p = ans[i];
            if(p.isSolved){
                var fileSrc = baseLocalUrl + p.title;
                fs.readdir(fileSrc,function(err,files){
                    files.forEach(function(file){
                        if(~file.indexOf('md')){
                            p.explaination = encodeURI(githubUrl + p.title +'/'+file);
                        }
                        if(~file.indexOf('js')){
                            p.language = 'javascript';
                            p.sourceCode = encodeURI(githubUrl + p.title +'/'+file);
                        }else if(!file.indexOf('cpp')){
                            p.language = 'C++';
                            p.sourceCode = encodeURI(githubUrl + p.title +'/'+file);
                        }
                    })
                })
            }
        })(i);
    }

    setTimeout(function(){
        makeMarkDownFile();
    },2000);
}
function makeRequest(){
    superagent
    .get("https://leetcode.com/problemset/algorithms/")
    .set()
    .end(function(err,res){
        var $ = cheerio.load(res.text);

        $('.question-list-table table tbody tr').each(function(index,item){
            var ele = $(item).children();
            var obj ={
                isSolved:ele.ep(0).attr('value') =='ac',
                problemId:ele.eq(1).html(),
                title:ele.eq(2).find("a").text(),
                url:"https://leetcode.com"+ele.eq(2).find("a").attr('href'),
                isLocked:ele.eq(2).html().indexOf('i')!==-1,
                difficulty:ele.eq(6).html(),
                acceptance:ele.eq(5).html()
            }
            ans.push(obj);
            totalnum++;
            obj.isSolved && solvednum++;
            obj.isLocked && lockednum++;
        });
        dealWithFile();
    });
}

makeRequest();
