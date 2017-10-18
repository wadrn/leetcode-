var superagent = require('superagent');
var cheerio = require('cheerio');
var fs = require('fs');

var ans = [];
var solvednum =0;
var totalnum = 0;
var tags =[];
var str='';
str += '#Leetcode Solutions with JavaScript  or C++';
str +='\n';
str += 'Update time: '+ new Date();
str +='\n';
str += 'I have solved **'+solvednum+' / '+totalnum +'** problems';
str +='\n';

function makeMarkDownFile(tag){
    str += 'Tag:'+tag;
    str += '\n';
    str += '| ID | Title | Source Code | Explaination | Difficulty | Acceptance | Tags |';
    str +='\n';
    str +='|:---:|:---:|:---:|:---:|:---:|:---:|:---:|';
    str +='\n';

    ans.sort(function(a,b){
        return parseInt(a.problemId) >parseInt(b.problemId);
    });

    for(var i=0;i<ans.length;i++){
        var item = ans[i];

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

        str +='| ' +problemId+ ' ';
        str +='| '+'['+title+']('+url+') ';

        if(isSolved){
            str += '| ' + '[' + language + '](' + sourceCode + ') ';
        }else{
            str +='| ';
        }
        if(explaination){
            str +='| '+'[Explaination]('+explaination+') ';
        }else{
            str +='| ';
        }
        str +='| '+difficulty+' ';
        str += '| '+acceptance+' ';
        str += '| '+tags+' |';
        str +='\n';
    }
    str += '\n'
}

function writeAll(){
    var makeFileSrc = '/Users/dongruining/leetcode-/README.md';
    fs.writeFile(makeFileSrc,str,function(err){
        if(err){
            throw err;
        }
        console.log('this file has been writed');
    });
    console.log('success');
}

function dealWithFile(tag){
    var baseLocalUrl = '/Users/dongruining/leetcode-/answers';
    var githubUrl = 'https://github.com/wadrn/leetcode-/tree/master/answers/';
    for(var i=0;i<ans.length;i++){
        (function(i){
            var p = ans[i];

            if(p.isSolved){
                var fileSrc = baseLocalUrl + p.title;
                fs.readdir(fileSrc,function(err,files){
                    if(err){
                        console.log(err);
                    }
                    files.forEach(function(file){
                        if(~file.indexOf('md')){
                            p.explaination = encodeURI(githubUrl + p.title +'/'+file);
                        }
                        if(~file.indexOf('js')){
                            p.language = 'javascript';
                            p.sourceCode = encodeURI(githubUrl + p.title +'/'+file);
                        }else if(~file.indexOf('cpp')){
                            p.language = 'C++';
                            p.sourceCode = encodeURI(githubUrl + p.title +'/'+file);
                        }
                    })
                })
            }
        })(i);
    }
    setTimeout(function(){
        makeMarkDownFile(tag);
    },1000);
}

function trim(str){
    return str.replace(/(^\s+)|(\s+$)/g,'');
}

function requestTags(){
    superagent
    .get("https://leetcode.com/problemset/algorithms/")
    .end(function(err,res){
        if(err){
            console.log(err);
        }
        var $ = cheerio.load(res.text);
        $('#current-topic-tags a').each(function(index,item){
            tags.push(trim($(item).attr('href').split('/')[2]));
        });
        console.log(tags);
        makeRequest(tags);
    });
}

function makeRequest(tags){
    for(var i=0;i<tags.length;i++){
        (function(i){
            ans=[];
            superagent
            .get("https://leetcode.com/tag/"+tags[i]+'/')
            .end(function(err,res){
                if(err){
                    console.log(err);
                }
                var $ = cheerio.load(res.text);
                $('#question_list tbody tr').each(function(index,item){
                    var ele = $(item).children();
                    var obj ={
                        isSolved:ele.eq(0).find('span').attr('class') =='ac',
                        problemId:trim(ele.eq(1).html()),
                        title:trim(ele.eq(2).find("a").eq(0).text()),
                        tags:trim(ele.eq(2).find("div").find("a").text()),
                        url:"https://leetcode.com"+trim(ele.eq(2).find("a").attr('href')),
                        difficulty:trim(ele.eq(4).find('span').html()),
                        acceptance:trim(ele.eq(3).html())
                    }
                    console.log(obj.problemId);
                    ans.push(obj);
                    totalnum++;
                    obj.isSolved && solvednum++;
                });
                console.log(tags[i]);
                dealWithFile(tags[i]);
            });
        })(i);
    }
    setTimeout(function(){
        writeAll();
    },10000);
}

requestTags();
