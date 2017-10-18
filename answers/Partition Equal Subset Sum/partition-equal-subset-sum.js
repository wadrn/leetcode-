/**
 * @param {number[]} nums
 * @return {boolean}
 */
var sum = function(start,end,nums){
    var sum = 0;
    for(var i=start;i<=end;i++){
        sum+= nums[i];
    }
    return sum;
}
var canPartition = function(nums) {
	nums.sort(function(a,b){
        return a-b;
    })
	var len = nums.length;
	var total = sum(0,len-1,nums);
	if(nums.length == 0){
		return true;
	}
	if(nums.length == 1){
		return false;
	}
	if(nums.length == 2){
		if(nums[0] ==nums[1]){
			return true;
		}else{
			return false;
		}
	}
	if(total%2!=0){
		return false;
	}
    var half =total/2;
    var dp=[];
    for(var i=0;i<=half;i++){
    	dp[i]=false;
    }
    dp[0]=true;
    for(var i=0;i<nums.length;i++){
    	if(nums[i]>half){
    		return false;
    	}else if(nums[i] == half){
    		return true;
    	}
    	for(var j=half;j>=nums[i];j--){
    		dp[j] = dp[j] || dp[j-nums[i]]
    	}
    }
    return dp[half];
};
