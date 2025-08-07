# Demo code with intentional issues for testing the Code Review Assistant

import *
from os import *

def badFunction():
    unused_variable = "This variable is never used"
    x = 5
    if x == 5:
        if x > 0:
            if x < 10:
                if x != 6:
                    if x != 7:
                        if x != 8:
                            if x != 9:
                                print("Very nested code")
    
    longFunctionThatDoesTooManyThings = "This should be broken down"
    for i in range(100):
        print(f"Line {i}")
        if i % 2 == 0:
            print("Even")
        else:
            print("Odd")
        if i % 3 == 0:
            print("Divisible by 3")
        if i % 5 == 0:
            print("Divisible by 5")
        if i % 7 == 0:
            print("Divisible by 7")

class badclass:
    def __init__(self):
        self.value = 10
    
    def method_without_docstring(self):
        return self.value * 2

var myVar = "Should use let or const";
if (myVar == "test") {
    console.log("Debug statement");
}