declare module Event {
    export const NONE: number;
    /**@deprecated*/ export const ABORT: number;
    /**@deprecated*/ export const BLUR: number;
    /**@deprecated*/ export const CLICK: number;
    /**@deprecated*/ export const CHANGE: number;
    /**@deprecated*/ export const DBLCLICK: number;
    /**@deprecated*/ export const DRAGDROP: number;
    /**@deprecated*/ export const ERROR: number;
    /**@deprecated*/ export const FOCUS: number;
    /**@deprecated*/ export const KEYDOWN: number;
    /**@deprecated*/ export const KEYPRESS: number;
    /**@deprecated*/ export const KEYUP: number;
    /**@deprecated*/ export const LOAD: number;
    /**@deprecated*/ export const MOUSEDOWN: number;
    /**@deprecated*/ export const MOUSEMOVE: number;
    /**@deprecated*/ export const MOUSEOUT: number;
    /**@deprecated*/ export const MOUSEOVER: number;
    /**@deprecated*/ export const MOUSEUP: number;
    /**@deprecated*/ export const MOVE: number;
    /**@deprecated*/ export const RESET: number;
    /**@deprecated*/ export const RESIZE: number;
    /**@deprecated*/ export const SELECT: number;
    /**@deprecated*/ export const UNLOAD: number;
}

interface KeyboardEvent extends UIEvent {
    readonly isComposing: string;
}

interface Navigator extends Object, NavigatorID, NavigatorOnLine, NavigatorContentUtils, NavigatorStorageUtils, NavigatorGeolocation, MSNavigatorDoNotTrack, MSFileSaver, NavigatorBeacon, NavigatorConcurrentHardware, NavigatorUserMedia {
    /**@deprecated*/ readonly systemLanguage: string;
    /**@deprecated*/ readonly userLanguage: string;
}

interface HTMLStyleElement extends HTMLElement, LinkStyle {
    /**@deprecated*/ readonly styleSheet: StyleSheet;
}

interface Window {
    //overrides default behaviour for window.location (any is required for completion)
    readonly location: Location | string | any;
    
    /**@deprecated*/ captureEvents(eventType: number): void;
    /**@deprecated*/ releaseEvents(eventType: number): void;
    
    print():void;
}

interface Document {
    //overrides default behaviour for document.location (any is required for completion)
    readonly location: Location | string | any;
}

interface HTMLTextAreaElement {
    selectionDirection: string;
}

/**
 * @deprecated The  function was deprecated in JavaScript version 1.5. Use decodeURI() or decodeURIComponent() instead
 */
declare var unescape:any;

/**
 * @deprecated The function was deprecated in JavaScript version 1.5. Use encodeURI() or encodeURIComponent() instead
 */
declare var escape:any;

interface Promise<T> {
    finally?<U>(onFinally?: () => U | Promise<U>): Promise<U>;
}


/**
 * https://github.com/Microsoft/TypeScript/issues/22917
 */
declare function print(): void;

interface BigInt extends Object {
}

interface BigIntConstructor {
    new(value: any): BigInt

    (value: any): BigInt

    asUintN(bits: number, bigint: BigInt): BigInt

    asIntN(bits: number, bigint: BigInt): BigInt
}

declare var BigInt: BigIntConstructor;

interface DataView {
    getBigInt64(byteOffset: number, littleEndian?: boolean): BigInt;


    getBigUint64(byteOffset: number, littleEndian?: boolean): BigInt;
    setBigInt64(byteOffset: number, value: BigInt, littleEndian?: boolean): void;

    setBigUint64(byteOffset: number, value: BigInt, littleEndian?: boolean): void;
}

interface BigInt64Array {

    readonly BYTES_PER_ELEMENT: number;

    /**
     * The ArrayBuffer instance referenced by the array.
     */
    readonly buffer: ArrayBufferLike;

    /**
     * The length in bytes of the array.
     */
    readonly byteLength: number;

    /**
     * The offset in bytes of the array.
     */
    readonly byteOffset: number;

    /**
     * Returns the this object after copying a section of the array identified by start and end
     * to the same array starting at position target
     * @param target If target is negative, it is treated as length+target where length is the
     * length of the array.
     * @param start If start is negative, it is treated as length+start. If end is negative, it
     * is treated as length+end.
     * @param end If not specified, length of the this object is used as its default value.
     */
    copyWithin(target: number, start: number, end?: number): this;

    /**
     * Determines whether all the members of an array satisfy the specified test.
     * @param callbackfn A function that accepts up to three arguments. The every method calls
     * the callbackfn function for each element in array1 until the callbackfn returns false,
     * or until the end of the array.
     * @param thisArg An object to which the this keyword can refer in the callbackfn function.
     * If thisArg is omitted, undefined is used as the this value.
     */
    every(callbackfn: (value: number, index: number, array: BigInt64Array) => boolean, thisArg?: any): boolean;

    /**
     * Returns the this object after filling the section identified by start and end with value
     * @param value value to fill array section with
     * @param start index to start filling the array at. If start is negative, it is treated as
     * length+start where length is the length of the array.
     * @param end index to stop filling the array at. If end is negative, it is treated as
     * length+end.
     */
    fill(value: number, start?: number, end?: number): this;

    /**
     * Returns the elements of an array that meet the condition specified in a callback function.
     * @param callbackfn A function that accepts up to three arguments. The filter method calls
     * the callbackfn function one time for each element in the array.
     * @param thisArg An object to which the this keyword can refer in the callbackfn function.
     * If thisArg is omitted, undefined is used as the this value.
     */
    filter(callbackfn: (value: number, index: number, array: BigInt64Array) => any, thisArg?: any): BigInt64Array;

    /**
     * Returns the value of the first element in the array where predicate is true, and undefined
     * otherwise.
     * @param predicate find calls predicate once for each element of the array, in ascending
     * order, until it finds one where predicate returns true. If such an element is found, find
     * immediately returns that element value. Otherwise, find returns undefined.
     * @param thisArg If provided, it will be used as the this value for each invocation of
     * predicate. If it is not provided, undefined is used instead.
     */
    find(predicate: (value: number, index: number, obj: BigInt64Array) => boolean, thisArg?: any): number | undefined;

    /**
     * Returns the index of the first element in the array where predicate is true, and -1
     * otherwise.
     * @param predicate find calls predicate once for each element of the array, in ascending
     * order, until it finds one where predicate returns true. If such an element is found,
     * findIndex immediately returns that element index. Otherwise, findIndex returns -1.
     * @param thisArg If provided, it will be used as the this value for each invocation of
     * predicate. If it is not provided, undefined is used instead.
     */
    findIndex(predicate: (value: number, index: number, obj: BigInt64Array) => boolean, thisArg?: any): number;

    /**
     * Performs the specified action for each element in an array.
     * @param callbackfn  A function that accepts up to three arguments. forEach calls the
     * callbackfn function one time for each element in the array.
     * @param thisArg  An object to which the this keyword can refer in the callbackfn function.
     * If thisArg is omitted, undefined is used as the this value.
     */
    forEach(callbackfn: (value: number, index: number, array: BigInt64Array) => void, thisArg?: any): void;

    /**
     * Returns the index of the first occurrence of a value in an array.
     * @param searchElement The value to locate in the array.
     * @param fromIndex The array index at which to begin the search. If fromIndex is omitted, the
     *  search starts at index 0.
     */
    indexOf(searchElement: number, fromIndex?: number): number;

    /**
     * Adds all the elements of an array separated by the specified separator string.
     * @param separator A string used to separate one element of an array from the next in the
     * resulting String. If omitted, the array elements are separated with a comma.
     */
    join(separator?: string): string;

    /**
     * Returns the index of the last occurrence of a value in an array.
     * @param searchElement The value to locate in the array.
     * @param fromIndex The array index at which to begin the search. If fromIndex is omitted, the
     * search starts at index 0.
     */
    lastIndexOf(searchElement: number, fromIndex?: number): number;

    /**
     * The length of the array.
     */
    readonly length: number;

    /**
     * Calls a defined callback function on each element of an array, and returns an array that
     * contains the results.
     * @param callbackfn A function that accepts up to three arguments. The map method calls the
     * callbackfn function one time for each element in the array.
     * @param thisArg An object to which the this keyword can refer in the callbackfn function.
     * If thisArg is omitted, undefined is used as the this value.
     */
    map(callbackfn: (value: number, index: number, array: BigInt64Array) => number, thisArg?: any): BigInt64Array;

    /**
     * Calls the specified callback function for all the elements in an array. The return value of
     * the callback function is the accumulated result, and is provided as an argument in the next
     * call to the callback function.
     * @param callbackfn A function that accepts up to four arguments. The reduce method calls the
     * callbackfn function one time for each element in the array.
     * @param initialValue If initialValue is specified, it is used as the initial value to start
     * the accumulation. The first call to the callbackfn function provides this value as an argument
     * instead of an array value.
     */
    reduce(callbackfn: (previousValue: number, currentValue: number, currentIndex: number, array: BigInt64Array) => number): number;

    reduce(callbackfn: (previousValue: number, currentValue: number, currentIndex: number, array: BigInt64Array) => number, initialValue: number): number;

    /**
     * Calls the specified callback function for all the elements in an array. The return value of
     * the callback function is the accumulated result, and is provided as an argument in the next
     * call to the callback function.
     * @param callbackfn A function that accepts up to four arguments. The reduce method calls the
     * callbackfn function one time for each element in the array.
     * @param initialValue If initialValue is specified, it is used as the initial value to start
     * the accumulation. The first call to the callbackfn function provides this value as an argument
     * instead of an array value.
     */
    reduce<U>(callbackfn: (previousValue: U, currentValue: number, currentIndex: number, array: BigInt64Array) => U, initialValue: U): U;

    /**
     * Calls the specified callback function for all the elements in an array, in descending order.
     * The return value of the callback function is the accumulated result, and is provided as an
     * argument in the next call to the callback function.
     * @param callbackfn A function that accepts up to four arguments. The reduceRight method calls
     * the callbackfn function one time for each element in the array.
     * @param initialValue If initialValue is specified, it is used as the initial value to start
     * the accumulation. The first call to the callbackfn function provides this value as an
     * argument instead of an array value.
     */
    reduceRight(callbackfn: (previousValue: number, currentValue: number, currentIndex: number, array: BigInt64Array) => number): number;

    reduceRight(callbackfn: (previousValue: number, currentValue: number, currentIndex: number, array: BigInt64Array) => number, initialValue: number): number;

    /**
     * Calls the specified callback function for all the elements in an array, in descending order.
     * The return value of the callback function is the accumulated result, and is provided as an
     * argument in the next call to the callback function.
     * @param callbackfn A function that accepts up to four arguments. The reduceRight method calls
     * the callbackfn function one time for each element in the array.
     * @param initialValue If initialValue is specified, it is used as the initial value to start
     * the accumulation. The first call to the callbackfn function provides this value as an argument
     * instead of an array value.
     */
    reduceRight<U>(callbackfn: (previousValue: U, currentValue: number, currentIndex: number, array: BigInt64Array) => U, initialValue: U): U;

    /**
     * Reverses the elements in an Array.
     */
    reverse(): BigInt64Array;

    /**
     * Sets a value or an array of values.
     * @param array A typed or untyped array of values to set.
     * @param offset The index in the current array at which the values are to be written.
     */
    set(array: ArrayLike<number>, offset?: number): void;

    /**
     * Returns a section of an array.
     * @param start The beginning of the specified portion of the array.
     * @param end The end of the specified portion of the array.
     */
    slice(start?: number, end?: number): BigInt64Array;

    /**
     * Determines whether the specified callback function returns true for any element of an array.
     * @param callbackfn A function that accepts up to three arguments. The some method calls the
     * callbackfn function for each element in array1 until the callbackfn returns true, or until
     * the end of the array.
     * @param thisArg An object to which the this keyword can refer in the callbackfn function.
     * If thisArg is omitted, undefined is used as the this value.
     */
    some(callbackfn: (value: number, index: number, array: BigInt64Array) => boolean, thisArg?: any): boolean;

    /**
     * Sorts an array.
     * @param compareFn The name of the function used to determine the order of the elements. If
     * omitted, the elements are sorted in ascending, ASCII character order.
     */
    sort(compareFn?: (a: number, b: number) => number): this;

    /**
     * Gets a new BigInt64Array view of the ArrayBuffer store for this array, referencing the elements
     * at begin, inclusive, up to end, exclusive.
     * @param begin The index of the beginning of the array.
     * @param end The index of the end of the array.
     */
    subarray(begin: number, end?: number): BigInt64Array;

    /**
     * Converts a number to a string by using the current locale.
     */
    toLocaleString(): string;

    /**
     * Returns a string representation of an array.
     */
    toString(): string;

    [index: number]: number;
}


interface BigInt64ArrayConstructor {
    readonly prototype: BigInt64Array;

    new(length: number): BigInt64Array;

    new(arrayOrArrayBuffer: ArrayLike<number> | ArrayBufferLike): BigInt64Array;

    new(buffer: ArrayBufferLike, byteOffset: number, length?: number): BigInt64Array;

    /**
     * The size in bytes of each element in the array.
     */
    readonly BYTES_PER_ELEMENT: number;

    /**
     * Returns a new array from a set of elements.
     * @param items A set of elements to include in the new array object.
     */
    of(...items: BigInt[]): BigInt64Array;

    /**
     * Creates an array from an array-like or iterable object.
     * @param arrayLike An array-like or iterable object to convert to an array.
     * @param mapfn A mapping function to call on every element of the array.
     * @param thisArg Value of 'this' used to invoke the mapfn.
     */
    from(arrayLike: ArrayLike<number>, mapfn?: (v: number, k: number) => number, thisArg?: any): BigInt64Array;

}

var BigInt64Array: BigInt64ArrayConstructor


interface BigUint64Array {

    readonly BYTES_PER_ELEMENT: number;

    /**
     * The ArrayBuffer instance referenced by the array.
     */
    readonly buffer: ArrayBufferLike;

    /**
     * The length in bytes of the array.
     */
    readonly byteLength: number;

    /**
     * The offset in bytes of the array.
     */
    readonly byteOffset: number;

    /**
     * Returns the this object after copying a section of the array identified by start and end
     * to the same array starting at position target
     * @param target If target is negative, it is treated as length+target where length is the
     * length of the array.
     * @param start If start is negative, it is treated as length+start. If end is negative, it
     * is treated as length+end.
     * @param end If not specified, length of the this object is used as its default value.
     */
    copyWithin(target: number, start: number, end?: number): this;

    /**
     * Determines whether all the members of an array satisfy the specified test.
     * @param callbackfn A function that accepts up to three arguments. The every method calls
     * the callbackfn function for each element in array1 until the callbackfn returns false,
     * or until the end of the array.
     * @param thisArg An object to which the this keyword can refer in the callbackfn function.
     * If thisArg is omitted, undefined is used as the this value.
     */
    every(callbackfn: (value: number, index: number, array: BigUint64Array) => boolean, thisArg?: any): boolean;

    /**
     * Returns the this object after filling the section identified by start and end with value
     * @param value value to fill array section with
     * @param start index to start filling the array at. If start is negative, it is treated as
     * length+start where length is the length of the array.
     * @param end index to stop filling the array at. If end is negative, it is treated as
     * length+end.
     */
    fill(value: number, start?: number, end?: number): this;

    /**
     * Returns the elements of an array that meet the condition specified in a callback function.
     * @param callbackfn A function that accepts up to three arguments. The filter method calls
     * the callbackfn function one time for each element in the array.
     * @param thisArg An object to which the this keyword can refer in the callbackfn function.
     * If thisArg is omitted, undefined is used as the this value.
     */
    filter(callbackfn: (value: number, index: number, array: BigUint64Array) => any, thisArg?: any): BigUint64Array;

    /**
     * Returns the value of the first element in the array where predicate is true, and undefined
     * otherwise.
     * @param predicate find calls predicate once for each element of the array, in ascending
     * order, until it finds one where predicate returns true. If such an element is found, find
     * immediately returns that element value. Otherwise, find returns undefined.
     * @param thisArg If provided, it will be used as the this value for each invocation of
     * predicate. If it is not provided, undefined is used instead.
     */
    find(predicate: (value: number, index: number, obj: BigUint64Array) => boolean, thisArg?: any): number | undefined;

    /**
     * Returns the index of the first element in the array where predicate is true, and -1
     * otherwise.
     * @param predicate find calls predicate once for each element of the array, in ascending
     * order, until it finds one where predicate returns true. If such an element is found,
     * findIndex immediately returns that element index. Otherwise, findIndex returns -1.
     * @param thisArg If provided, it will be used as the this value for each invocation of
     * predicate. If it is not provided, undefined is used instead.
     */
    findIndex(predicate: (value: number, index: number, obj: BigUint64Array) => boolean, thisArg?: any): number;

    /**
     * Performs the specified action for each element in an array.
     * @param callbackfn  A function that accepts up to three arguments. forEach calls the
     * callbackfn function one time for each element in the array.
     * @param thisArg  An object to which the this keyword can refer in the callbackfn function.
     * If thisArg is omitted, undefined is used as the this value.
     */
    forEach(callbackfn: (value: number, index: number, array: BigUint64Array) => void, thisArg?: any): void;

    /**
     * Returns the index of the first occurrence of a value in an array.
     * @param searchElement The value to locate in the array.
     * @param fromIndex The array index at which to begin the search. If fromIndex is omitted, the
     *  search starts at index 0.
     */
    indexOf(searchElement: number, fromIndex?: number): number;

    /**
     * Adds all the elements of an array separated by the specified separator string.
     * @param separator A string used to separate one element of an array from the next in the
     * resulting String. If omitted, the array elements are separated with a comma.
     */
    join(separator?: string): string;

    /**
     * Returns the index of the last occurrence of a value in an array.
     * @param searchElement The value to locate in the array.
     * @param fromIndex The array index at which to begin the search. If fromIndex is omitted, the
     * search starts at index 0.
     */
    lastIndexOf(searchElement: number, fromIndex?: number): number;

    /**
     * The length of the array.
     */
    readonly length: number;

    /**
     * Calls a defined callback function on each element of an array, and returns an array that
     * contains the results.
     * @param callbackfn A function that accepts up to three arguments. The map method calls the
     * callbackfn function one time for each element in the array.
     * @param thisArg An object to which the this keyword can refer in the callbackfn function.
     * If thisArg is omitted, undefined is used as the this value.
     */
    map(callbackfn: (value: number, index: number, array: BigUint64Array) => number, thisArg?: any): BigUint64Array;

    /**
     * Calls the specified callback function for all the elements in an array. The return value of
     * the callback function is the accumulated result, and is provided as an argument in the next
     * call to the callback function.
     * @param callbackfn A function that accepts up to four arguments. The reduce method calls the
     * callbackfn function one time for each element in the array.
     * @param initialValue If initialValue is specified, it is used as the initial value to start
     * the accumulation. The first call to the callbackfn function provides this value as an argument
     * instead of an array value.
     */
    reduce(callbackfn: (previousValue: number, currentValue: number, currentIndex: number, array: BigUint64Array) => number): number;

    reduce(callbackfn: (previousValue: number, currentValue: number, currentIndex: number, array: BigUint64Array) => number, initialValue: number): number;

    /**
     * Calls the specified callback function for all the elements in an array. The return value of
     * the callback function is the accumulated result, and is provided as an argument in the next
     * call to the callback function.
     * @param callbackfn A function that accepts up to four arguments. The reduce method calls the
     * callbackfn function one time for each element in the array.
     * @param initialValue If initialValue is specified, it is used as the initial value to start
     * the accumulation. The first call to the callbackfn function provides this value as an argument
     * instead of an array value.
     */
    reduce<U>(callbackfn: (previousValue: U, currentValue: number, currentIndex: number, array: BigUint64Array) => U, initialValue: U): U;

    /**
     * Calls the specified callback function for all the elements in an array, in descending order.
     * The return value of the callback function is the accumulated result, and is provided as an
     * argument in the next call to the callback function.
     * @param callbackfn A function that accepts up to four arguments. The reduceRight method calls
     * the callbackfn function one time for each element in the array.
     * @param initialValue If initialValue is specified, it is used as the initial value to start
     * the accumulation. The first call to the callbackfn function provides this value as an
     * argument instead of an array value.
     */
    reduceRight(callbackfn: (previousValue: number, currentValue: number, currentIndex: number, array: BigUint64Array) => number): number;

    reduceRight(callbackfn: (previousValue: number, currentValue: number, currentIndex: number, array: BigUint64Array) => number, initialValue: number): number;

    /**
     * Calls the specified callback function for all the elements in an array, in descending order.
     * The return value of the callback function is the accumulated result, and is provided as an
     * argument in the next call to the callback function.
     * @param callbackfn A function that accepts up to four arguments. The reduceRight method calls
     * the callbackfn function one time for each element in the array.
     * @param initialValue If initialValue is specified, it is used as the initial value to start
     * the accumulation. The first call to the callbackfn function provides this value as an argument
     * instead of an array value.
     */
    reduceRight<U>(callbackfn: (previousValue: U, currentValue: number, currentIndex: number, array: BigUint64Array) => U, initialValue: U): U;

    /**
     * Reverses the elements in an Array.
     */
    reverse(): BigUint64Array;

    /**
     * Sets a value or an array of values.
     * @param array A typed or untyped array of values to set.
     * @param offset The index in the current array at which the values are to be written.
     */
    set(array: ArrayLike<number>, offset?: number): void;

    /**
     * Returns a section of an array.
     * @param start The beginning of the specified portion of the array.
     * @param end The end of the specified portion of the array.
     */
    slice(start?: number, end?: number): BigUint64Array;

    /**
     * Determines whether the specified callback function returns true for any element of an array.
     * @param callbackfn A function that accepts up to three arguments. The some method calls the
     * callbackfn function for each element in array1 until the callbackfn returns true, or until
     * the end of the array.
     * @param thisArg An object to which the this keyword can refer in the callbackfn function.
     * If thisArg is omitted, undefined is used as the this value.
     */
    some(callbackfn: (value: number, index: number, array: BigUint64Array) => boolean, thisArg?: any): boolean;

    /**
     * Sorts an array.
     * @param compareFn The name of the function used to determine the order of the elements. If
     * omitted, the elements are sorted in ascending, ASCII character order.
     */
    sort(compareFn?: (a: number, b: number) => number): this;

    /**
     * Gets a new BigUint64Array view of the ArrayBuffer store for this array, referencing the elements
     * at begin, inclusive, up to end, exclusive.
     * @param begin The index of the beginning of the array.
     * @param end The index of the end of the array.
     */
    subarray(begin: number, end?: number): BigUint64Array;

    /**
     * Converts a number to a string by using the current locale.
     */
    toLocaleString(): string;

    /**
     * Returns a string representation of an array.
     */
    toString(): string;

    [index: number]: number;
}


interface BigUint64ArrayConstructor {
    readonly prototype: BigUint64Array;

    new(length: number): BigUint64Array;

    new(arrayOrArrayBuffer: ArrayLike<number> | ArrayBufferLike): BigUint64Array;

    new(buffer: ArrayBufferLike, byteOffset: number, length?: number): BigUint64Array;

    /**
     * The size in bytes of each element in the array.
     */
    readonly BYTES_PER_ELEMENT: number;

    /**
     * Returns a new array from a set of elements.
     * @param items A set of elements to include in the new array object.
     */
    of(...items: BigInt[]): BigUint64Array;

    /**
     * Creates an array from an array-like or iterable object.
     * @param arrayLike An array-like or iterable object to convert to an array.
     * @param mapfn A mapping function to call on every element of the array.
     * @param thisArg Value of 'this' used to invoke the mapfn.
     */
    from(arrayLike: ArrayLike<number>, mapfn?: (v: number, k: number) => number, thisArg?: any): BigUint64Array;

}

var BigUint64Array: BigUint64ArrayConstructor

//unsupported properties:
// Object.prototype.__proto__
//window.opera
//document.selection
//Element.prototype.detachEvent
//Element.prototype.attachEvent
//Event.prototype.clientX
//Event.prototype.clientY
//Event.prototype.offsetX
//Event.prototype.offsetY
//Event.prototype.altKey
//Event.prototype.ctrlKey
//Event.prototype.repeat
//Event.prototype.shiftKey
//Event.prototype.keyCode
//Element.prototype.currentStyle
//Location.prototype.target
//document.namespaces
//RegExp.input;
//RegExp.rightContext
//RegExp.lastParen
//RegExp.leftContext
//RegExp.rightContext
//Element.prototype.setCapture()
//Element.prototype.releaseCapture()
//Element.prototype.clearAttributes()
//Element.prototype.mergeAttributes()
//Element.prototype.fireEvent() 
//document.createEventObject()
//Event.prototype.propertyName
//Element.prototype.isDisabled
//document.styleSheet
//window.showModalDialog
//sourceIndex
//doScroll
//window.execScript
//window.CollectGarbage
//getBookmark
//moveToBookmark
//document.documentMode
