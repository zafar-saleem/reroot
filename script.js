var _ = require('lodash');

var tree    = [1, [2, [4]], [3]];
var zipTree = _.partial(_.zipObject, ['root', 'left', 'right']);
var toTree  = _.flow(zipTree, _.partial(_.pick, _, _.identity));

function arrayToObject(data) {
    var result = toTree(data);
    
    if (_.isArray(result.left)) {
        result.left = arrayToObject(result.left);
    }
    
    if (_.isArray(result.right)) {
        result.right = arrayToObject(result.right);
    }

    return result;
}

function objectToArray(tree) {
    var result = [tree.root];

    if (tree.left) {
        result.push(objectToArray(tree.left));
    }
    
    if (tree.right) {
        result.push(objectToArray(tree.right));
    }

    return result;
}

function findParentNode(tree, value) {
    if (!tree) {
        return null;
    }

    var result;

    if (_.get(tree, 'left.root') === value) {
        return tree;
    } else if (_.get(tree, 'right.root') === value) {
        return tree;
    } else if (result = findParentNode(tree.left, value)) {
        return result;
    } else if (result = findParentNode(tree.right, value)) {
        return result;
    } else {
        return null;
    }
}

function reroot(T, X) {
    var convertArrToObj = arrayToObject(T);
    var rootParent = findParentNode(convertArrToObj, X);
    var newRoot;

    if (rootParent) {
        var fromSide, toSide;

        if (findParentNode(convertArrToObj.left, X) || (_.get(convertArrToObj, 'left.root') === X)) {
            fromSide = 'left';
            toSide = 'right';
        } else if (findParentNode(convertArrToObj.right, X) || (_.get(convertArrToObj, 'right.root') === X)) {
            fromSide = 'right';
            toSide = 'left';
        }

        newRoot = _.get(rootParent, fromSide);

        if (_.get(newRoot, toSide)) {
            _.set(rootParent, fromSide, _.get(newRoot, toSide));
        } else {
            delete rootParent[fromSide];
        }

        _.set(newRoot, toSide, convertArrToObj);

        return objectToArray(newRoot);
    } else {
        console.log('value does not exist');
        return null;
    }
}

console.log(reroot(tree, 2));
