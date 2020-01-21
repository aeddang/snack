/**
 * lib v1.0: jQueryUtil
 * by aeddang
 */
/*
interfaces


*/

if(typeof jarvis == "undefined") var jarvis = new Object();

jarvis.Sort = function() 
{
}

jarvis.Sort.prototype =
{
	binSearch : function(arr,findValue)
	{
	   	var upper = arr.length-1;
	    var lower = 0;
	    while (lower <= upper) 
	    {
	        var mid = Math.floor((upper + lower) / 2);
	        if (arr[mid] < findValue) 
	        {
	         	lower = mid + 1;
	        }
	      	else if (arr[mid] > findValue)
	      	{
	         	upper = mid - 1;
	      	}
	      	else 
	      	{
	         	return mid;
	      	}
	   	}
	   	return -1;
	},


	bubble : function(arr)
	{
	   	var len = arr.length;
	   	for (var i = len-1; i>=0; --i)
	   	{
	     	for(var j = 1; j<=i; ++j)
	     	{
	       		if(arr[j-1]>arr[j])
	       		{
	           		var temp = arr[j-1];
	           		arr[j-1] = arr[j];
	           		arr[j] = temp;
	        	}
	     	}
	    }
   		return arr;
	},

	selection : function (arr)
	{
  		var minIdx, temp, 
      	len = arr.length;
  		for(var i = 0; i < len; ++i)
  		{
    		minIdx = i;
    		for(var  j = i+1; j<len; j++)
    		{
       			if(arr[j]<arr[minIdx])
       			{
          			minIdx = j;
       			}
    		}
    		temp = arr[i];
    		arr[i] = arr[minIdx];
    		arr[minIdx] = temp;
  		}
  		return arr;
	},

	insertion : function (arr,toInsert)
	{
	  	var i, len = arr.length, el, j;
		for(i = 1; i<len; ++i)
		{
	    	el = arr[i];
	    	j = i;
	    	while(j>0 && arr[j-1]>toInsert)
	    	{
	      		arr[j] = arr[j-1];
	      		j--;
	   		}
	   		arr[j] = el;
	  	}
		return arr;
	},


	merge : function(arr)
	{
	   	var len = arr.length;
	   	if(len <2) return arr;
	   	var mid = Math.floor(len/2),
	    left = arr.slice(0,mid),
	    right =arr.slice(mid);
	   	return this.mergeAction(this.merge(left),this.merge(right));

	},

	mergeAction : function (left, right)
	{
		var result = [],
  		lLen = left.length,
  		rLen = right.length,
  		l = 0,
  		r = 0;
		while(l < lLen && r < rLen)
		{
 			if(left[l] < right[r])
 			{
   				result.push(left[l++]);
 			}
 			else
 			{
   				result.push(right[r++]);
			}
		}  
		return result.concat(left.slice(l)).concat(right.slice(r));
	},

	quick : function (arr, left, right)
	{
	   	var len = arr.length, 
	   	pivot,
	   	partitionIndex;
		if(left < right){
	    	pivot = right;
	    	partitionIndex = this.partition(arr, pivot, left, right);
	    	this.quick(arr, left, partitionIndex - 1);
	   		this.quick(arr, partitionIndex + 1, right);
	  	}
	  	return arr;
	},

	partition : function (arr, pivot, left, right)
	{
	   	var pivotValue = arr[pivot],
	    partitionIndex = left;

	   	for(var i = left; i < right; ++i)
	   	{
	    	if(arr[i] < pivotValue)
	    	{
	      		this.swap(arr, i, partitionIndex);
	      		partitionIndex++;
	    	}
	  	}
	  	this.swap(arr, right, partitionIndex);
	  	return partitionIndex;
	},


	heapSort : function (arr)
	{
  		var len = arr.length,
      	end = len-1;
		this.heapify(arr, len);
  		while(end > 0)
  		{
   			this.swap(arr, end--, 0);
   			this.siftDown(arr, 0, end);
  		}
  		return arr;
	},

	heapify : function (arr, len)
	{
   		var mid = Math.floor((len-2)/2);
   		while(mid >= 0)
   		{
    		this.siftDown(arr, mid--, len-1);    
  		}
	},

	siftDown : function (arr, start, end)
	{
   		var root = start,
       	child = root*2 + 1,
       	toSwap = root;
   		while(child <= end)
   		{
      		if(arr[toSwap] < arr[child])
      		{
        		this.swap(arr, toSwap, child);
      		}
      		if(child+1 <= end && arr[toSwap] < arr[child+1])
      		{
        		this.swap(arr, toSwap, child+1)
      		}
      		if(toSwap != root)
      		{
         		this.swap(arr, root, toSwap);
         		root = toSwap;
      		}
      		else
      		{
         		return; 
      		}
      		toSwap = root;
      		child = root*2+1
  		}
	},

	swap : function (arr, i, j)
	{
   		var temp = arr[i];
   		arr[i] = arr[j];
   		arr[j] = temp;
	}

}


 