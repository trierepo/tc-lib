# REST Services Docs
## OP Service(tcOPService)
###### create
creates new op

```
{
    "name": "OP Name",
    "opDate": "2018-10-10";
	"doctor": {
        "id": "1"
    },
	"isFuture": true
}
```
response: 
{
    "id": "10"
    "name": "OP Name",
    "opDate": "2018-10-10";
	"doctor": {
        "id": "1"
    },
	"isFuture": true
}
```
###### search
search : api service
get : api service
statusList : api service
configCreate : api service
configList : api service