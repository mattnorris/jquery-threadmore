# Threadmore
View and hide comments on a page with this [jQuery](http://jquery.com/) plugin. 

## Getting Started
### HTML
Given a list of comments: 

```html
<ul id="comment_thread">
  <li>Comment 1</li>
  <li>Comment 2</li>
  <li>Comment 3</li>
  <li>Comment 4</li>
  <li>Comment 5</li>
</ul>
```

### JavaScript
Call **Threadmore** on the list: 

```html
<script type="text/javascript">
  $(function() {
    $('#comment_thread').threadmore();
  }
</script>
```

This will hide all of the comments except the first two (like Facebook) and place two links directly underneath: "more" and "less". The "more" link shows the rest of the comments. The "less" link hides all of them except the top two. This behavior can be overridden. 

## What if I don't use lists? 

There are reasons that you may not use lists to hold comments. What if the comments are more complicated than simple text, and contain profile pictures, links, and timestamps? This is handled simply by overriding the _elType_ parameter. Suppose you have a container of _divs_ instead: 

```html
<section id="complex_comment_thread">
  <div>
    <img src="unknown_user.png" />
    <p>Comment 1</p>
  </div>
  <div>
    <img src="unknown_user.png" />
    <p>Comment 2</p>
  </div>
  <div>
    <img src="unknown_user.png" />
    <p>Comment 3</p>
  </div>
</section>
```

Simply pass "div" as the _elType_: 
```html
<script type="text/javascript">
  $(function() {
    $('#complex_comment_thread').threadmore( {
      elType: "div"
    });
  }
</script>
```

## Other options

Just like _elType_, the rest of **Threadmore's** options can be customized. 

1. _initVisible_ - the number of items to shown initially
2. _toShow_ - the number of items shown with each click; if 0, shows all the remaining items
3. _toHide_ - the number of items hidden with each click; if 0, hides all except the number visible initially
4. _aCTA_ - "cta-active" - the class name for the "call to action" links
5. _iCTA_ - "cta-inactive" - the class name for the inactivated CTA links
6. _disShow_ - "more" - the text of the more control
7. _disHide_ - "less" - the text to of the less control
8. _elType_ - "li" - the container's repeated element type (li, div, etc.)

To do so, pass a dictionary of _options_ as a second parameter: 

```html
<script type="text/javascript">
  $(function() {
    var options = {initVisible: 5, 
                   disShow: "Show more comments", 
                   disHide: "Hide most comments"}
    $('#complex_comment_thread').threadmore(options);
  }
</script>
```

