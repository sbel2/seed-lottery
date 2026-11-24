# The seed lottery: narration script

Edit the text after each **bold key**. Keep the keys (`hook`, `net`, ...) so each line can be matched back to its picture.

- To cut a line, delete its text or write CUT.
- To add a line, add a new row where it belongs and say what should be on screen.
- Numbers in the lines (78%, 60.8%, 82.5%, 21.7, 11.2, 19.0, 6.2, 30, 48) come from the simulation. Move them around freely, but don't change their values.
- "2,100" and "2020" are from the paper.

Current length: 2:33, 32 lines.

## 1. Setup

1. **hook** (9.0s) · _on screen: Two dots appear on the accuracy axis_

   Often times, training the same model twice can get you two very different performances. A 2020 paper by Dodge and colleagues measured how big that gap gets.

2. **net** (5.5s) · _on screen: Network appears (grey pretrained layers)_

   Here’s a small neural network. The grey layers stand in for a pretrained model like BERT.

3. **task** (4.7s) · _on screen: Two sentence pairs: one "same meaning", one "different"_

   We fine-tune it for one task, like judging whether two sentences mean the same thing.

4. **tune** (4.0s) · _on screen: Training examples and accuracy readout appear_

   It trains on 64 examples and is tested on 400 new ones.

5. **head** (7.9s) · _on screen: New output layer gets random weights_

   Because the new task has its own set of outputs, we add a fresh output layer, whose weights are randomly initialized rather than pretrained.

6. **data** (3.0s) · _on screen: Example blocks shuffle_

   And the training examples get reshuffled before every pass.

7. **seed** (4.7s) · _on screen: Seed dial lights up, feeding both_

   The seed sets the starting weights and training order. And now we run the network.

8. **run1** (6.1s) · _on screen: Seed 1 trains, six passes_

   Here’s training with seed 1. Six passes through the examples, each in its own shuffled order.

9. **score1** (2.5s) · _on screen: Orange dot lands on the axis_

   It gets 78% of the test examples right.


## 2. The one thing: the spread

10. **change** (1.6s) · _on screen: Seeds 3, 4, 5 train quickly_

   Now change only the seed.

11. **hundred** (1.5s) · _on screen: Dots pile up to 100_

   Here are a hundred seeds.

12. **dist** (2.2s) · _on screen: Axis highlighted_

   Each dot is one full training run.

13. **swing** (8.4s) · _on screen: Bracket across the whole spread_

   The worst scored 60.8%, the best 82.5%. That’s a 21.7-point spread from the seed alone.

14. **paper1** (6.5s) · _on screen: Same picture, held_

   Ours is a toy model, but the paper saw the same performance swings with the real BERT, across 2,100 runs.


## 3. The two types of randomness

15. **suspects** (6.4s) · _on screen: Weights and order highlighted_

   Out of the two things that the seed sets, the starting weights and the shuffle order. Which one causes the spread?

16. **lockW** (2.5s) · _on screen: Weights locked, order changes, 10 runs_

   Let’s first fix the weights and change only the order.

17. **g1** (2.7s) · _on screen: Bracket on those 10 dots_

   Accuracy still moves 11.2 points.

18. **lockO** (2.2s) · _on screen: Order locked (blocks stay still), weights change, 10 runs_

   Now fix the order and change only the weights.

19. **g2** (5.8s) · _on screen: Bracket on those 10 dots_

   19.0 points. Both matter, and in the paper they mattered about equally.


## 4. Why it matters: A versus B

20. **catch** (3.6s) · _on screen: All 100 dots, "Method A: 1 try / Method B: 20 tries" cards_

   That’s a problem, because papers usually report one number, not a hundred.

21. **ab** (4.5s) · _on screen: Random draws flicker; A and B flags land_

   Say method A reports a single run, and method B reports its best of twenty.

22. **abgap** (3.9s) · _on screen: Bracket: B ahead_

   B comes out 6.2 points ahead and looks like the better method.

23. **fair** (1.8s) · _on screen: A card changes to 20 tries; A flag slides to B_

   Now give A twenty tries as well,

24. **tie** (4.8s) · _on screen: Bracket: identical_

   and the gap disappears. It was the same method. B just had more tries.

25. **fix** (2.5s) · _on screen: Same picture, held_

   So compare methods at the same number of tries.


## 5. The three steps

26. **race1** (5.0s) · _on screen: Empty race chart_

   More tries cost more compute, so the paper suggests a cheaper search, in three steps.

27. **step1** (2.5s) · _on screen: 100 curves grow to the quarter mark_

   One, start many runs. Let’s say 100.

28. **step2** (4.7s) · _on screen: Cut line; 70 curves go grey_

   Two, stop the weak ones early. A quarter of the way in, we keep the top 30.

29. **step3** (2.0s) · _on screen: 30 curves run to the end_

   Three, finish only the best.

30. **race3** (5.8s) · _on screen: Best run highlighted; "48 runs of compute, not 100"_

   The best run of all 100 is among the 30 we kept, for about 48 runs’ worth of training instead of 100.


## 6. Conclusion

31. **wrap** (8.9s) · _on screen: All 100 dots with the full-spread bracket_

   Here is the conclusion: A 21.7-point spread from two random choices. So search seeds cheaply, and compare methods at equal tries.

32. **end** (3.4s) · _on screen: Same picture, held_

    And when you see a single score, ask how many seeds it took.

