/*
 *  SplitsBrowser - AgeClassSet tests.
 *  
 *  Copyright (C) 2000-2013 Dave Ryder, Reinhard Balling, Andris Strazdins,
 *                          Ed Nash, Luke Woodward
 *
 *  This program is free software; you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation; either version 2 of the License, or
 *  (at your option) any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License along
 *  with this program; if not, write to the Free Software Foundation, Inc.,
 *  51 Franklin Street, Fifth Floor, Boston, MA 02110-1301 USA.
 */
(function () {
    "use strict";
    
    module("Age-class set");

    var _DUMMY_CHART_TYPE = {
        name: "dummy",
        dataSelector: function (comp, referenceCumTimes) { return comp.getCumTimesAdjustedToReference(referenceCumTimes); },
        skipStart: false
    };
    
    var isNaNStrict = SplitsBrowser.isNaNStrict;
    var AgeClass = SplitsBrowser.Model.AgeClass;
    var Course = SplitsBrowser.Model.Course;
    var fromSplitTimes = SplitsBrowser.Model.Competitor.fromSplitTimes;
    var fromCumTimes = SplitsBrowser.Model.Competitor.fromCumTimes;
    var fromOriginalCumTimes = SplitsBrowser.Model.Competitor.fromOriginalCumTimes;
    var AgeClassSet = SplitsBrowser.Model.AgeClassSet;
    
    function getCompetitor1() {
        return fromSplitTimes(1, "John Smith", "ABC", 10 * 3600, [65, 221, 209, 100]);
    }
    
    function getFasterCompetitor1() {
        return fromSplitTimes(1, "John Smith", "ABC", 10 * 3600, [65, 221, 184, 100]);
    }
    
    function getCompetitor1WithNullSplitForControl2() {
        return fromSplitTimes(1, "John Smith", "ABC", 10 * 3600, [65, null, 184, 100]);
    }
    
    function getCompetitor1WithDubiousSplitForControl2() {
        var competitor = fromOriginalCumTimes(1, "John Smith", "ABC", 10 * 3600, [0, 65, 65 - 10, 65 + 221 + 184, 65 + 221 + 184 + 100]);
        competitor.setCleanedCumulativeTimes([0, 65, NaN, 65 + 221 + 184, 65 + 221 + 184 + 100]);
        return competitor;
    }
    
    function getCompetitor1WithNullSplitForControl3() {
        return fromSplitTimes(1, "John Smith", "ABC", 10 * 3600, [65, 221, null, 100]);
    }
    
    function getCompetitor1WithNullFinishSplit() {
        return fromSplitTimes(1, "John Smith", "ABC", 10 * 3600, [65, 221, 184, null]);
    }
    
    function getCompetitor1WithSameControl2SplitAsThatOfCompetitor2() {
        return fromSplitTimes(1, "John Smith", "ABC", 10 * 3600, [65, 197, 209, 100]);
    }
    
    function getCompetitor2() {
        return fromSplitTimes(2, "Fred Brown", "DEF", 10 * 3600 + 30 * 60, [81, 197, 212, 106]);
    }
    
    function getCompetitor2WithNullSplitForControl2() {
        return fromSplitTimes(1, "Fred Brown", "DEF", 10 * 3600 + 30 * 60, [81, null, 212, 106]);
    }
    
    function getCompetitor2WithNullSplitForControl3() {
        return fromSplitTimes(1, "Fred Brown", "DEF", 10 * 3600 + 30 * 60, [81, 197, null, 106]);
    }
    
    function getCompetitor2WithNullFinishSplit() {
        return fromSplitTimes(2, "Fred Brown", "DEF", 10 * 3600 + 30 * 60, [81, 197, 212, null]);
    }
    
    function getCompetitor3() {
        return fromSplitTimes(3, "Bill Baker", "GHI", 11 * 3600, [78, 209, 199, 117]);    
    }
    
    function getCompetitor3WithSameTotalTimeAsCompetitor1() {
        return fromSplitTimes(3, "Bill Baker", "GHI", 11 * 3600, [78, 209, 199, 109]);
    }
    
    function getCompetitor3WithNullSplitForControl2() {
        return fromSplitTimes(3, "Bill Baker", "GHI", 11 * 3600, [78, null, 199, 117]);
    }
    
    function getCompetitor3WithNullSplitForControl3() {
        return fromSplitTimes(3, "Bill Baker", "GHI", 11 * 3600, [78, 209, null, 117]);
    }
    
    function getCompetitor3WithNullFinishSplit() {
        return fromSplitTimes(3, "Bill Baker", "GHI", 11 * 3600, [78, 209, 199, null]);
    }
    
    QUnit.test("Cannot create an AgeClassSet from an empty array of of age classes", function (assert) {
        SplitsBrowserTest.assertInvalidData(assert, function() {
            new AgeClassSet([]);
        });
    });
    
    QUnit.test("Can create an AgeClassSet from a single age class", function (assert) {
        var ageClass = new AgeClass("Test", 3, [getCompetitor1(), getCompetitor2(), getCompetitor3()]);
        var ageClassSet = new AgeClassSet([ageClass]);
        assert.deepEqual(ageClassSet.allCompetitors, ageClass.competitors, "An AgeClassSet created from one age class should contain the only the competitors of that class");
    });
    
    QUnit.test("Can create an AgeClassSet from a single age class and get the course", function (assert) {
        var ageClass = new AgeClass("Test", 3, [getCompetitor1()]);
        var course = new Course("Test course", [ageClass], null, null, null);
        ageClass.setCourse(course);
        var ageClassSet = new AgeClassSet([ageClass]);
        assert.deepEqual(ageClassSet.getCourse(), course);
    });
    
    QUnit.test("Can create an AgeClassSet from a single age class and get the primary class name as that of the given class", function (assert) {
        var ageClass = new AgeClass("Test", 3, [getCompetitor1()]);
        var ageClassSet = new AgeClassSet([ageClass]);
        assert.deepEqual(ageClassSet.getPrimaryClassName(), ageClass.name);
    });
    
    QUnit.test("Can create an AgeClassSet from a multiple age class and get the primary class name as that of the first class", function (assert) {
        var ageClass1 = new AgeClass("Test class 1", 3, [getCompetitor1()]);
        var ageClass2 = new AgeClass("Test class 2", 3, [getCompetitor2()]);
        var ageClassSet = new AgeClassSet([ageClass1, ageClass2]);
        assert.deepEqual(ageClassSet.getPrimaryClassName(), ageClass1.name);
    });
    
    QUnit.test("Can create an AgeClassSet from a single age class, sorting competitors into order", function (assert) {
        var competitor1 = getCompetitor1();
        var competitor2 = getCompetitor2();
        var competitor3 = getCompetitor3();
        var ageClass = new AgeClass("Test", 3, [competitor3, competitor1, competitor2]);
        var ageClassSet = new AgeClassSet([ageClass]);
        var expectedCompetitors = [competitor1, competitor2, competitor3];
        assert.deepEqual(ageClassSet.allCompetitors, expectedCompetitors, "An AgeClassSet created from one age class should contain the only the competitors of that class");
    });
    
    QUnit.test("Can create an AgeClassSet from two age classes", function (assert) {
        var competitor1 = getCompetitor1();
        var competitor2 = getCompetitor2();
        var competitor3 = getCompetitor3();
        var ageClass1 = new AgeClass("Test", 3, [competitor3, competitor1]);
        var ageClass2 = new AgeClass("Test", 3, [competitor2]);
        var ageClassSet = new AgeClassSet([ageClass1, ageClass2]);
        var expectedCompetitors = [competitor1, competitor2, competitor3];
        assert.deepEqual(ageClassSet.allCompetitors, expectedCompetitors, "Merging one age class should return the only the competitors of that class");
    });
    
    QUnit.test("Cannot create an AgeClassSet from two age classes with different numbers of controls", function (assert) {
        var competitor2 = fromSplitTimes(1, "Fred Brown", "DEF", 10 * 3600 + 30 * 60, [81, 197, 212, 106, 108]);
        var ageClass1 = new AgeClass("Test", 3, [getCompetitor1()]);
        var ageClass2 = new AgeClass("Test", 4, [competitor2]);
        SplitsBrowserTest.assertInvalidData(assert, function () {
            new AgeClassSet([ageClass1, ageClass2]);
        });
    });
    
    QUnit.test("AgeClassSet created from two age classes has two age classes", function (assert) {
        var ageClass1 = new AgeClass("Test class 1", 3, [getCompetitor1()]);
        var ageClass2 = new AgeClass("Test class 2", 3, [getCompetitor2()]);
        var ageClassSet = new AgeClassSet([ageClass1, ageClass2]);
        assert.deepEqual(ageClassSet.getNumClasses(), 2, "Age-class set should have two classes");
    });

    QUnit.test("Cumulative times of the winner of an empty age-class set is null", function (assert) {
        var ageClassSet = new AgeClassSet([new AgeClass("Test", 3, [])]);
        assert.strictEqual(ageClassSet.getWinnerCumTimes(), null, "There should be no winner if there are no competitors");
    });

    QUnit.test("Cumulative times of the winner of an age-class set with only mispunchers is null", function (assert) {
        var ageClassSet = new AgeClassSet([new AgeClass("Test", 3, [
            getCompetitor1WithNullFinishSplit(),
            getCompetitor2WithNullSplitForControl2()
        ])]);
        assert.strictEqual(ageClassSet.getWinnerCumTimes(), null, "There should be no winner if there are no competitors that completed the course");
    });

    QUnit.test("Cumulative times of the winner of a single-class set are those with quickest time", function (assert) {
        var ageClassSet = new AgeClassSet([new AgeClass("Test", 3, [getCompetitor2(), getFasterCompetitor1()])]);
        var winTimes = ageClassSet.getWinnerCumTimes();
        assert.deepEqual(winTimes, [0, 65, 65 + 221, 65 + 221 + 184, 65 + 221 + 184 + 100], "John Smith (second competitor) should be the winner");
    });

    QUnit.test("Cumulative times of the winner of a multiple-class set are those with quickest time", function (assert) {
        var ageClassSet = new AgeClassSet([new AgeClass("Test 1", 3, [getCompetitor2()]), new AgeClass("Test 2", 3, [getFasterCompetitor1()])]);
        var winTimes = ageClassSet.getWinnerCumTimes();
        assert.deepEqual(winTimes, [0, 65, 65 + 221, 65 + 221 + 184, 65 + 221 + 184 + 100], "John Smith (second competitor) from the second course should be the winner");
    });

    QUnit.test("Fastest cumulative times on age-class set with no competitors is null", function (assert) {
        var ageClassSet = new AgeClassSet([new AgeClass("Test", 3, [])]);
        assert.strictEqual(ageClassSet.getFastestCumTimes(), null, "Empty age-class set should have null fastest time");
    });

    QUnit.test("Fastest cumulative times on age-class set with one control mispunched by everyone is null", function (assert) {
        var ageClassSet = new AgeClassSet([new AgeClass("Test", 3, [getCompetitor1WithNullSplitForControl2(), getCompetitor2WithNullSplitForControl2()])]);
        assert.strictEqual(ageClassSet.getFastestCumTimes(), null, "Class with one control mispunched by all should have null fastest time");
    });

    QUnit.test("Fastest cumulative times on a single-class set should be made up of fastest times", function (assert) {
        var ageClassSet = new AgeClassSet([new AgeClass("Test", 3, [getFasterCompetitor1(), getCompetitor2()])]);
        assert.deepEqual(ageClassSet.getFastestCumTimes(), [0, 65, 65 + 197, 65 + 197 + 184, 65 + 197 + 184 + 100], "Fastest cumulative time should be made up of fastest splits");
    });

    QUnit.test("Fastest cumulative times on a multiple-class set should be made up of fastest times from competitors from both classes", function (assert) {
        var ageClassSet = new AgeClassSet([new AgeClass("Test 1 ", 3, [getFasterCompetitor1()]), new AgeClass("Test 2", 3, [getCompetitor2()])]);
        assert.deepEqual(ageClassSet.getFastestCumTimes(), [0, 65, 65 + 197, 65 + 197 + 184, 65 + 197 + 184 + 100], "Fastest cumulative time should be made up of fastest splits");
    });

    QUnit.test("Fastest cumulative times plus 75% on single-class set should be made up of fastest times with 75%", function (assert) {
        var ageClassSet = new AgeClassSet([new AgeClass("Test", 3, [getFasterCompetitor1(), getCompetitor2()])]);
        assert.deepEqual(ageClassSet.getFastestCumTimesPlusPercentage(75), [0, 65 * 1.75, (65 + 197) * 1.75, (65 + 197 + 184) * 1.75, (65 + 197 + 184 + 100) * 1.75],
                                "Fastest cumulative times + 75% should be made up of fastest cumulative splits with 75% added");
    });

    QUnit.test("Fastest cumulative times on single-class set should be made up of fastest split times ignoring nulls", function (assert) {
        var ageClassSet = new AgeClassSet([new AgeClass("Test", 3, [getCompetitor1WithNullFinishSplit(), getCompetitor2WithNullSplitForControl2()])]);
        assert.deepEqual(ageClassSet.getFastestCumTimes(), [0, 65, 65 + 221, 65 + 221 + 184, 65 + 221 + 184 + 106],
                            "Fastest cumulative times should be made up of fastest splits where not null");
    });

    QUnit.test("Fastest cumulative times on single-class set should be made up of fastest split times ignoring dubious splits", function (assert) {
        var ageClassSet = new AgeClassSet([new AgeClass("Test", 3, [getCompetitor1WithDubiousSplitForControl2(), getCompetitor2()])]);
        assert.deepEqual(ageClassSet.getFastestCumTimes(), [0, 65, 65 + 197, 65 + 197 + 212, 65 + 197 + 212 + 100],
                            "Fastest cumulative times should be made up of fastest splits where not NaN");
    });
    
    function assertSplitRanks(assert, competitor, expectedSplitRanks) {
        expectedSplitRanks.forEach(function (splitRank, index) {
            if (isNaNStrict(splitRank)) {
                assert.ok(isNaNStrict(competitor.getSplitRankTo(index + 1)));
            } else {
                assert.strictEqual(competitor.getSplitRankTo(index + 1), splitRank);
            }
        });
    }
    
    function assertCumulativeRanks(assert, competitor, expectedCumulativeRanks) {
        expectedCumulativeRanks.forEach(function (cumulativeRank, index) {
            if (isNaNStrict(cumulativeRank)) {
                assert.ok(isNaNStrict(competitor.getCumulativeRankTo(index + 1)));
            } else {
                assert.strictEqual(competitor.getCumulativeRankTo(index + 1), cumulativeRank);
            }
        });
    }
    
    function assertSplitAndCumulativeRanks(assert, competitor, expectedSplitRanks, expectedCumulativeRanks) {
        assertSplitRanks(assert, competitor, expectedSplitRanks);
        assertCumulativeRanks(assert, competitor, expectedCumulativeRanks);
    }
    
    QUnit.test("Can compute ranks of single competitor as all 1s", function (assert) {
        var competitor = getCompetitor1();
        new AgeClassSet([new AgeClass("Test", 3, [competitor])]);
        assertSplitAndCumulativeRanks(assert, competitor, [1, 1, 1, 1], [1, 1, 1, 1]);
    });
    
    QUnit.test("Can compute ranks in single-class set when there are two competitors with no equal times", function (assert) {
        var competitor1 = getCompetitor1();
        var competitor2 = getCompetitor2();
        new AgeClassSet([new AgeClass("Test", 3, [competitor1, competitor2])]);
        
        assertSplitAndCumulativeRanks(assert, competitor1, [1, 2, 1, 1], [1, 2, 2, 1]);
        assertSplitAndCumulativeRanks(assert, competitor2, [2, 1, 2, 2], [2, 1, 1, 2]);
    });
    
    QUnit.test("Can compute ranks in multiple-class set when there are two competitors with no equal times", function (assert) {
        var competitor1 = getCompetitor1();
        var competitor2 = getCompetitor2();
        new AgeClassSet([new AgeClass("Test 1", 3, [competitor1]), new AgeClass("Test 2", 3, [competitor2])]);
        
        assertSplitAndCumulativeRanks(assert, competitor1, [1, 2, 1, 1], [1, 2, 2, 1]);
        assertSplitAndCumulativeRanks(assert, competitor2, [2, 1, 2, 2], [2, 1, 1, 2]);
    });
    
    QUnit.test("Can compute ranks when there are three competitors with no equal times", function (assert) {
        var competitor1 = getCompetitor1();
        var competitor2 = getCompetitor2();
        var competitor3 = getCompetitor3();
        new AgeClassSet([new AgeClass("Test", 3, [competitor1, competitor2, competitor3])]);
        
        assertSplitAndCumulativeRanks(assert, competitor1, [1, 3, 2, 1], [1, 2, 3, 1]);
        assertSplitAndCumulativeRanks(assert, competitor2, [3, 1, 3, 2], [3, 1, 2, 2]);
        assertSplitAndCumulativeRanks(assert, competitor3, [2, 2, 1, 3], [2, 3, 1, 3]);
    });
    
    QUnit.test("Can compute ranks when there are three competitors with one pair of equal split times", function (assert) {
        var competitor1 = getCompetitor1WithSameControl2SplitAsThatOfCompetitor2();
        var competitor2 = getCompetitor2();
        var competitor3 = getCompetitor3();
        new AgeClassSet([new AgeClass("Test", 3, [competitor1, competitor2, competitor3])]);
        
        assertSplitAndCumulativeRanks(assert, competitor1, [1, 1, 2, 1], [1, 1, 1, 1]);
        assertSplitAndCumulativeRanks(assert, competitor2, [3, 1, 3, 2], [3, 2, 3, 2]);
        assertSplitAndCumulativeRanks(assert, competitor3, [2, 3, 1, 3], [2, 3, 2, 3]);
    });
    
    QUnit.test("Can compute ranks when there are three competitors with one pair of equal cumulative times", function (assert) {
        var competitor1 = getCompetitor1();
        var competitor2 = getCompetitor2();
        var competitor3 = getCompetitor3WithSameTotalTimeAsCompetitor1();
        new AgeClassSet([new AgeClass("Test", 3, [competitor1, competitor2, competitor3])]);
        
        assertSplitAndCumulativeRanks(assert, competitor1, [1, 3, 2, 1], [1, 2, 3, 1]);
        assertSplitAndCumulativeRanks(assert, competitor2, [3, 1, 3, 2], [3, 1, 2, 3]);
        assertSplitAndCumulativeRanks(assert, competitor3, [2, 2, 1, 3], [2, 3, 1, 1]);
    });
    
    QUnit.test("Can compute ranks when there are three competitors with one missing split times", function (assert) {
        var competitor1 = getCompetitor1();
        var competitor2 = getCompetitor2WithNullSplitForControl2();
        var competitor3 = getCompetitor3();
        new AgeClassSet([new AgeClass("Test", 3, [competitor1, competitor2, competitor3])]);
        
        assertSplitAndCumulativeRanks(assert, competitor1, [1, 2, 2, 1], [1, 1, 2, 1]);
        assertSplitAndCumulativeRanks(assert, competitor2, [3, null, 3, 2], [3, null, null, null]);
        assertSplitAndCumulativeRanks(assert, competitor3, [2, 1, 1, 3], [2, 2, 1, 2]);
    });
    
    QUnit.test("Can compute ranks when there is one control that all three competitors mispunch", function (assert) {
        var competitor1 = getCompetitor1WithNullFinishSplit();
        var competitor2 = getCompetitor2WithNullFinishSplit();
        var competitor3 = getCompetitor3WithNullFinishSplit();
        new AgeClassSet([new AgeClass("Test", 3, [competitor1, competitor2, competitor3])]);
        
        assertSplitAndCumulativeRanks(assert, competitor1, [1, 3, 1, null], [1, 2, 1, null]);
        assertSplitAndCumulativeRanks(assert, competitor2, [3, 1, 3, null], [3, 1, 3, null]);
        assertSplitAndCumulativeRanks(assert, competitor3, [2, 2, 2, null], [2, 3, 2, null]);
    });
    
    QUnit.test("Can compute ranks when there are three competitors specified by cumulative times with one missing split times", function (assert) {
        var competitor1 = fromCumTimes(1, "Fred Brown", "DEF", 10 * 3600 + 30 * 60, [0, 81, 81 + 197, 81 + 197 + 212, 81 + 197 + 212 + 106]);
        var competitor2 = fromCumTimes(2, "John Smith", "ABC", 10 * 3600, [0, 65, 65 + 221, 65 + 221 + 209, 65 + 221 + 209 + 100]);
        var competitor3 = fromCumTimes(2, "Bill Baker", "GHI", 11 * 3600, [0, 78, null,     78 + 209 + 199, 78 + 209 + 199 + 117]);
        new AgeClassSet([new AgeClass("Test", 3, [competitor1, competitor2, competitor3])]);
        
        assertSplitAndCumulativeRanks(assert, competitor1, [3, 1, 2, 2], [3, 1, 1, 2]);
        assertSplitAndCumulativeRanks(assert, competitor2, [1, 2, 1, 1], [1, 2, 2, 1]);
        
        // No cumulative ranks from control 2 onwards: as competitor 3
        // mispunches they no don't have a cumulative rank from that point
        // onwards.
        assertSplitAndCumulativeRanks(assert, competitor3, [2, null, null, 3], [2, null, null, null]);
    });
    
    QUnit.test("Can compute ranks when there are three competitors specified by cumulative times with one having a dubious split time", function (assert) {
        var competitor1 = fromCumTimes(1, "Fred Brown", "DEF", 10 * 3600 + 30 * 60, [0, 81, 81 + 197, 81 + 197 + 212, 81 + 197 + 212 + 106]);
        var competitor2 = fromCumTimes(2, "John Smith", "ABC", 10 * 3600, [0, 65, 65 + 221, 65 + 221 + 209, 65 + 221 + 209 + 100]);
        var competitor3 = fromOriginalCumTimes(2, "Bill Baker", "GHI", 11 * 3600, [0, 78, 78 - 30, 78 + 209 + 199, 78 + 209 + 199 + 117]);
        competitor3.setCleanedCumulativeTimes([0, 78, NaN, 78 + 209 + 199, 78 + 209 + 199 + 117]);
        new AgeClassSet([new AgeClass("Test", 3, [competitor1, competitor2, competitor3])]);
        
        assertSplitAndCumulativeRanks(assert, competitor1, [3, 1, 2, 2], [3, 1, 2, 2]);
        assertSplitAndCumulativeRanks(assert, competitor2, [1, 2, 1, 1], [1, 2, 3, 1]);
        
        assertSplitAndCumulativeRanks(assert, competitor3, [2, NaN, NaN, 3], [2, NaN, 1, 3]);
    });
    
    QUnit.test("Can get fastest two splits to control 3 from single-class set with three competitors", function (assert) {
        var competitor1 = getCompetitor1();
        var competitor2 = getCompetitor2();
        var competitor3 = getCompetitor3();
        var ageClassSet = new AgeClassSet([new AgeClass("Test", 3, [competitor1, competitor2, competitor3])]);
        
        var fastestSplits = ageClassSet.getFastestSplitsTo(2, 3);
        assert.deepEqual(fastestSplits, [{split: 199, name: competitor3.name}, {split: 209, name: competitor1.name}]);
    });
    
    QUnit.test("Can get fastest two splits to control 3 from multiple-class set with three competitors", function (assert) {
        var competitor1 = getCompetitor1();
        var competitor2 = getCompetitor2();
        var competitor3 = getCompetitor3();
        var ageClassSet = new AgeClassSet([new AgeClass("Test 1", 3, [competitor1]), new AgeClass("Test 2", 3, [competitor2, competitor3])]);
        
        var fastestSplits = ageClassSet.getFastestSplitsTo(2, 3);
        assert.deepEqual(fastestSplits, [{split: 199, name: competitor3.name}, {split: 209, name: competitor1.name}]);
    });
    
    QUnit.test("Can get fastest two splits to finish from single-class set with three competitors", function (assert) {
        var competitor1 = getCompetitor1();
        var competitor2 = getCompetitor2();
        var competitor3 = getCompetitor3();
        var ageClassSet = new AgeClassSet([new AgeClass("Test", 3, [competitor1, competitor2, competitor3])]);
        
        var fastestSplits = ageClassSet.getFastestSplitsTo(2, 4);
        assert.deepEqual(fastestSplits, [{split: 100, name: competitor1.name}, {split: 106, name: competitor2.name}]);
    });
    
    QUnit.test("When getting fastest four splits to control 3 from single-class set with three competitors then three splits returned", function (assert) {
        var competitor1 = getCompetitor1();
        var competitor2 = getCompetitor2();
        var competitor3 = getCompetitor3();
        var ageClassSet = new AgeClassSet([new AgeClass("Test", 3, [competitor1, competitor2, competitor3])]);
        
        var fastestSplits = ageClassSet.getFastestSplitsTo(4, 3);
        assert.deepEqual(fastestSplits, [{split: 199, name: competitor3.name}, {split: 209, name: competitor1.name}, {split: 212, name: competitor2.name}]);
    });
    
    QUnit.test("When getting fastest two splits to control 3 from single-class set with three competitors with one mispunching control 3 then splits for other two competitors returned", function (assert) {
        var competitor1 = getCompetitor1WithNullSplitForControl3();
        var competitor2 = getCompetitor2();
        var competitor3 = getCompetitor3();
        var ageClassSet = new AgeClassSet([new AgeClass("Test", 3, [competitor1, competitor2, competitor3])]);
        
        var fastestSplits = ageClassSet.getFastestSplitsTo(2, 3);
        assert.deepEqual(fastestSplits, [{split: 199, name: competitor3.name}, {split: 212, name: competitor2.name}]);
    });
    
    QUnit.test("When getting fastest two splits to control 3 from single-class set with three competitors with one mispunching a different control then splits for other two competitors returned", function (assert) {
        var competitor1 = getCompetitor1();
        var competitor2 = getCompetitor2();
        var competitor3 = getCompetitor3WithNullSplitForControl2();
        var ageClassSet = new AgeClassSet([new AgeClass("Test", 3, [competitor1, competitor2, competitor3])]);
        
        var fastestSplits = ageClassSet.getFastestSplitsTo(2, 3);
        assert.deepEqual(fastestSplits, [{split: 209, name: competitor1.name}, {split: 212, name: competitor2.name}]);
    });
    
    QUnit.test("When getting fastest two splits to control 3 from single-class set with three competitors with two mispunching control 3 then one split returned", function (assert) {
        var competitor1 = getCompetitor1WithNullSplitForControl3();
        var competitor2 = getCompetitor2();
        var competitor3 = getCompetitor3WithNullSplitForControl3();
        var ageClassSet = new AgeClassSet([new AgeClass("Test", 3, [competitor1, competitor2, competitor3])]);
        
        var fastestSplits = ageClassSet.getFastestSplitsTo(2, 3);
        assert.deepEqual(fastestSplits, [{split: 212, name: competitor2.name}]);
    });

    /**
    * Asserts that attempting to get the fastest splits of the given competitors
    * will fail with an InvalidData exception.
    * @param {QUnit.assert} assert - QUnit assertion object.
    * @param {Array} competitors - Array of competitor objects.
    * @param {Number} numSplits - The number of fastest splits to attempt to return.
    * @param {Number} controlIdx - The index of the control.
    */
    function assertCannotGetFastestSplits(assert, competitors, numSplits, controlIdx) {
        var ageClassSet = new AgeClassSet([new AgeClass("Test", 3, competitors)]);
        SplitsBrowserTest.assertInvalidData(assert, function () {
            ageClassSet.getFastestSplitsTo(numSplits, controlIdx);        
        });
    }
    
    QUnit.test("Cannot return fastest 0 splits to a control", function (assert) {
        assertCannotGetFastestSplits(assert, [getCompetitor1()], 0, 3);
    });
    
    QUnit.test("Cannot return fastest splits to a control when the number of such splits is not numeric", function (assert) {
        assertCannotGetFastestSplits(assert, [getCompetitor1()], "this is not a number", 3);
    });
    
    QUnit.test("Cannot return fastest splits to control zero", function (assert) {
        assertCannotGetFastestSplits(assert, [getCompetitor1()], 1, 0);
    });
    
    QUnit.test("Cannot return fastest splits to control out of range", function (assert) {
        assertCannotGetFastestSplits(assert, [getCompetitor1()], 1, 5);
    });
    
    QUnit.test("Cannot return fastest splits to control that is not a number", function (assert) {
        assertCannotGetFastestSplits(assert, [getCompetitor1()], 1, "this is not a number");
    });

    QUnit.test("Can return chart data for two competitors in same class", function (assert) {
        var ageClassSet = new AgeClassSet([new AgeClass("Test", 3, [getFasterCompetitor1(), getCompetitor2()])]);
        var fastestTime = ageClassSet.getFastestCumTimes();

        var chartData = ageClassSet.getChartData(fastestTime, [0, 1], _DUMMY_CHART_TYPE);

        var expectedChartData = {
            dataColumns: [
                { x: 0, ys: [0, 0] },
                { x: 65, ys: [0, 16] },
                { x: 65 + 197, ys: [24, 16] },
                { x: 65 + 197 + 184, ys: [24, 44] },
                { x: 65 + 197 + 184 + 100, ys: [24, 50] }
            ],
            xExtent: [0, 65 + 197 + 184 + 100],
            yExtent: [0, 50],
            numControls: 3,
            competitorNames: ["John Smith", "Fred Brown"]
        };

        assert.deepEqual(chartData, expectedChartData);
    });

    QUnit.test("Can return chart data for two competitors in different classes of the set", function (assert) {
        var ageClassSet = new AgeClassSet([new AgeClass("Test 1", 3, [getFasterCompetitor1()]), new AgeClass("Test 2", 3, [getCompetitor2()])]);
        var fastestTime = ageClassSet.getFastestCumTimes();

        var chartData = ageClassSet.getChartData(fastestTime, [0, 1], _DUMMY_CHART_TYPE);

        var expectedChartData = {
            dataColumns: [
                { x: 0, ys: [0, 0] },
                { x: 65, ys: [0, 16] },
                { x: 65 + 197, ys: [24, 16] },
                { x: 65 + 197 + 184, ys: [24, 44] },
                { x: 65 + 197 + 184 + 100, ys: [24, 50] }
            ],
            xExtent: [0, 65 + 197 + 184 + 100],
            yExtent: [0, 50],
            numControls: 3,
            competitorNames: ["John Smith", "Fred Brown"]
        };

        assert.deepEqual(chartData, expectedChartData);
    });

    QUnit.test("Can return chart data for first competitor only", function (assert) {
        var ageClassSet = new AgeClassSet([new AgeClass("Test", 3, [getFasterCompetitor1(), getCompetitor2()])]);
        var fastestTime = ageClassSet.getFastestCumTimes();

        var chartData = ageClassSet.getChartData(fastestTime, [0], _DUMMY_CHART_TYPE);

        var expectedChartData = {
            dataColumns: [
                { x: 0, ys: [0] },
                { x: 65, ys: [0] },
                { x: 65 + 197, ys: [24] },
                { x: 65 + 197 + 184, ys: [24] },
                { x: 65 + 197 + 184 + 100, ys: [24] }
            ],
            xExtent: [0, 65 + 197 + 184 + 100],
            yExtent: [0, 24],
            numControls: 3,
            competitorNames: ["John Smith"]
        };

        assert.deepEqual(chartData, expectedChartData);
    });

    QUnit.test("Can return chart data for second competitor only as columns", function (assert) {
        var ageClassSet = new AgeClassSet([new AgeClass("Test", 3, [getFasterCompetitor1(), getCompetitor2()])]);
        var fastestTime = ageClassSet.getFastestCumTimes();

        var chartData = ageClassSet.getChartData(fastestTime, [1], _DUMMY_CHART_TYPE);

        var expectedChartData = {
            dataColumns: [
                { x: 0, ys: [0] },
                { x: 65, ys: [16] },
                { x: 65 + 197, ys: [16] },
                { x: 65 + 197 + 184, ys: [44] },
                { x: 65 + 197 + 184 + 100, ys: [50] }
            ],
            xExtent: [0, 65 + 197 + 184 + 100],
            yExtent: [0, 50],
            numControls: 3,
            competitorNames: ["Fred Brown"]
        };

        assert.deepEqual(chartData, expectedChartData);
    });

    QUnit.test("Can return chart data for empty list of competitors", function (assert) {
        var ageClassSet = new AgeClassSet([new AgeClass("Test", 3, [getFasterCompetitor1(), getCompetitor2()])]);
        var fastestTime = ageClassSet.getFastestCumTimes();

        var chartData = ageClassSet.getChartData(fastestTime, [], _DUMMY_CHART_TYPE);

        var expectedChartData = {
            dataColumns: [],
            xExtent: [0, 65 + 197 + 184 + 100],
            yExtent: chartData.yExtent, // Deliberately set this equal, we'll test it later.
            numControls: 3,
            competitorNames: []
        };

        assert.deepEqual(chartData, expectedChartData);

        assert.ok(chartData.yExtent[0] < chartData.yExtent[1], "The y-axis should have a positive extent: got values " + chartData.yExtent[0] + " and " + chartData.yExtent[1]);
    });    

    QUnit.test("Cannot return chart data when no competitors", function (assert) {
        var ageClassSet = new AgeClassSet([new AgeClass("Test", 3, [])]);
        SplitsBrowserTest.assertInvalidData(assert, function () {
            ageClassSet.getChartData([0, 87, 87 + 147, 87 + 147 + 92], [0, 2], _DUMMY_CHART_TYPE);
        });
    });

    QUnit.test("Cannot return chart data when no reference data given", function (assert) {
        var ageClassSet = new AgeClassSet([new AgeClass("Test", 3, [getFasterCompetitor1(), getCompetitor2()])]);
        SplitsBrowserTest.assertException(assert, "TypeError", function () {
            ageClassSet.getChartData();
        });
    });

    QUnit.test("Cannot return chart data when no current indexes given", function (assert) {
        var ageClassSet = new AgeClassSet([new AgeClass("Test", 3, [getFasterCompetitor1(), getCompetitor2()])]);
        SplitsBrowserTest.assertException(assert, "TypeError", function () {
            ageClassSet.getChartData([0, 65, 65 + 197, 65 + 197 + 184, 65 + 197 + 184 + 100], _DUMMY_CHART_TYPE);
        });
    });
    
    QUnit.test("Age-class set with a single class with splits for all controls has splits for all controls", function (assert) {
        var ageClassSet = new AgeClassSet([new AgeClass("Test", 3, [getCompetitor1()])]);
        assert.deepEqual(ageClassSet.getControlsWithNoSplits(), []);
    });
    
    QUnit.test("Age-class set with a single class missing a split for control 3 is also missing a split for the same control", function (assert) {
        var ageClassSet =  new AgeClassSet([new AgeClass("Test class", 3, [getCompetitor1WithNullSplitForControl3()])]);
        assert.deepEqual(ageClassSet.getControlsWithNoSplits(), [3]);
    });
    
    QUnit.test("Age-class set with one class having splits for all controls and one class having a missing split has splits for all controls", function (assert) {
        var ageClassSet = new AgeClassSet([
            new AgeClass("Test class 1", 3, [getCompetitor1()]),
            new AgeClass("Test class 2", 3, [getCompetitor2WithNullSplitForControl3()])
        ]);
        assert.deepEqual(ageClassSet.getControlsWithNoSplits(), []);
    });
    
    QUnit.test("Age-class set with two classes, each of which contains no splits for control 3 also does not have a split for control 3", function (assert) {
        var ageClassSet = new AgeClassSet([
            new AgeClass("Test class 1", 3, [getCompetitor1WithNullSplitForControl3()]),
            new AgeClass("Test class 2", 3, [getCompetitor2WithNullSplitForControl3()])
        ]);
        assert.deepEqual(ageClassSet.getControlsWithNoSplits(), [3]);
    });
    
    QUnit.test("Age-class set with two competitors mispunching different controls has splits for all controls", function (assert) {
        var ageClassSet = new AgeClassSet([
            new AgeClass("Test class 1", 3, [getCompetitor1WithNullSplitForControl3()]),
            new AgeClass("Test class 2", 3, [getCompetitor2WithNullSplitForControl2()])
        ]);
        assert.deepEqual(ageClassSet.getControlsWithNoSplits(), []);
    });
    
})();